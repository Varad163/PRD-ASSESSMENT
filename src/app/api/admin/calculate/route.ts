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
    // 1. GET DRAW
    const { data: draw } = await supabase
      .from("draws")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!draw) {
      return NextResponse.json({ error: "No draw found" }, { status: 404 })
    }

    const drawNumbers = draw.numbers

    // 2. GET SCORES
    const { data: scores } = await supabase
      .from("scores")
      .select("*")

    if (!scores || scores.length === 0) {
      return NextResponse.json({ error: "No scores found" }, { status: 400 })
    }

    // 3. GET SUBSCRIPTIONS (POOL)
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("*")

    const totalPool = (subs?.length || 0) * 100

    // 4. GROUP
    const groups: Record<number, any[]> = {
      5: [],
      4: [],
      3: [],
    }

    for (const score of scores) {
      const matches = score.values.filter((n: number) =>
        drawNumbers.includes(n)
      ).length

      if (matches >= 3) {
        groups[matches].push(score)
      }
    }

    // 5. CREATE WINNERS
    const winners = []

    for (const match of [5, 4, 3]) {
      const group = groups[match]
      if (!group.length) continue

      const percentage = getPercentage(match)
      const totalPrize = totalPool * percentage
      const perUserPrize = totalPrize / group.length

      for (const score of group) {
        if (!score.user_id) continue

        winners.push({
          user_id: score.user_id,
          score_id: score.id,
          draw_id: draw.id,
          match_count: match,
          prize_amount: Math.floor(perUserPrize),
          status: "pending",
        })
      }
    }

    // 6. INSERT
    const { error } = await supabase
      .from("winners")
      .insert(winners)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      winners: winners.length,
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}