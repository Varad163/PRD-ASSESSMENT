import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

function getPercentage(matches: number) {
  if (matches === 5) return 0.5
  if (matches === 4) return 0.3
  if (matches === 3) return 0.2
  return 0
}

export async function POST() {
  try {
    // 🔥 1. GET LATEST DRAW
    const { data: draw, error: drawError } = await supabase
      .from("draws")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (drawError || !draw) {
      return NextResponse.json(
        { error: "No draw found" },
        { status: 404 }
      )
    }

    // ✅ parse draw numbers
    const drawNumbers =
      typeof draw.numbers === "string"
        ? JSON.parse(draw.numbers)
        : draw.numbers

    console.log("DRAW:", drawNumbers)

    // 🔥 2. GET SCORES
    const { data: scores, error: scoreError } = await supabase
      .from("scores")
      .select("*")

    if (scoreError || !scores || scores.length === 0) {
      return NextResponse.json(
        { error: "No scores found" },
        { status: 400 }
      )
    }

    console.log("TOTAL SCORES:", scores.length)

    // 🔥 3. GET SUBSCRIPTIONS → POOL
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("*")

    const totalPool = (subs?.length || 0) * 100

    console.log("TOTAL POOL:", totalPool)

    // 🔥 4. BEST SCORE PER USER (IMPORTANT FIX)
    const bestScores: Record<string, any> = {}

    for (const score of scores) {
      const userNumbers =
        typeof score.values === "string"
          ? JSON.parse(score.values)
          : score.values

      if (!userNumbers || !Array.isArray(userNumbers)) continue

      const matches = userNumbers.filter((n: number) =>
        drawNumbers.includes(n)
      ).length

      if (!score.user_id) continue

      // ✅ keep BEST match only
      if (
        !bestScores[score.user_id] ||
        bestScores[score.user_id].matches < matches
      ) {
        bestScores[score.user_id] = {
          ...score,
          matches,
        }
      }
    }

    console.log("BEST SCORES:", bestScores)

    // 🔥 5. GROUP BY MATCH COUNT
    const groups: Record<number, any[]> = {
      5: [],
      4: [],
      3: [],
    }

    for (const userId in bestScores) {
      const score = bestScores[userId]

      if (score.matches >= 3) {
        groups[score.matches].push(score)
      }
    }

    console.log("GROUPS:", groups)

    // 🔥 6. DELETE OLD WINNERS (avoid duplicates)
    await supabase
      .from("winners")
      .delete()
      .eq("draw_id", draw.id)

    // 🔥 7. CREATE WINNERS
    const winners: any[] = []

    for (const match of [5, 4, 3]) {
      const group = groups[match]
      if (!group || group.length === 0) continue

      const percentage = getPercentage(match)
      const totalPrize = totalPool * percentage
      const perUserPrize = totalPrize / group.length

      for (const score of group) {
        winners.push({
          user_id: score.user_id,
          score_id: score.id, // best score
          draw_id: draw.id,
          match_count: match,
          prize_amount: Math.floor(perUserPrize),
          status: "pending",
        })
      }
    }

    console.log("FINAL WINNERS:", winners)

    // 🚨 no winners case
    if (winners.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No winners this draw",
        winners: 0,
      })
    }

    // 🔥 8. INSERT WINNERS
    const { error: insertError } = await supabase
      .from("winners")
      .insert(winners)

    if (insertError) {
      console.error("INSERT ERROR:", insertError)

      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      winners: winners.length,
    })

  } catch (err) {
    console.error("SERVER ERROR:", err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}