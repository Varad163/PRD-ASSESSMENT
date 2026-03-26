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
    // 🔥 1. get latest draw
    const { data: draw, error: drawError } = await supabase
      .from("draws")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (drawError || !draw) {
      return NextResponse.json({ error: "No draw found" }, { status: 404 })
    }

    const drawNumbers = draw.numbers

    // 🔥 2. get scores
    const { data: scores, error: scoreError } = await supabase
      .from("scores")
      .select("*")

    if (scoreError || !scores) {
      return NextResponse.json({ error: "No scores found" }, { status: 404 })
    }

    // 🔥 3. get subscriptions → prize pool
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("*")

    const totalPool = (subs?.length || 0) * 100

    // 🔥 4. classify winners
    const groups: Record<number, any[]> = {
      5: [],
      4: [],
      3: [],
    }

    for (const s of scores) {
      const matches = s.values.filter((n: number) =>
        drawNumbers.includes(n)
      ).length

      if (matches >= 3) {
        groups[matches].push(s)
      }
    }

    // 🔥 5. distribute money
    const winners = []

    for (const match of [5, 4, 3]) {
      const group = groups[match]
      if (!group || group.length === 0) continue

      const percentage = getPercentage(match)
      const totalPrize = totalPool * percentage
      const perUserPrize = totalPrize / group.length

      for (const user of group) {
        winners.push({
          user_id: user.user_id,
          score_id: user.id,
          draw_id: draw.id,
          match_count: match,
          prize_amount: Math.floor(perUserPrize),
          status: "pending",
        })
      }
    }

    // 🔥 6. insert winners
    const { error: insertError } = await supabase
      .from("winners")
      .insert(winners)

    if (insertError) {
      console.error("INSERT ERROR:", insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      totalPool,
      winners: winners.length,
    })

  } catch (err) {
    console.error("CALC ERROR:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}