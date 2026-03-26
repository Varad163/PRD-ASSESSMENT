import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // 🔥 1. GET LATEST DRAW
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

    const drawNumbers: number[] = draw.numbers

    // 🔥 2. GET ALL USER SCORES
    const { data: scores } = await supabase
      .from("scores")
      .select("*")

    if (!scores || scores.length === 0) {
      return NextResponse.json({ error: "No scores found" }, { status: 404 })
    }

    const winners: any[] = []

    // 🔥 3. MATCH LOGIC
    for (const score of scores) {
      const userNumbers: number[] = score.values

      const matches = userNumbers.filter(n =>
        drawNumbers.includes(n)
      ).length

      // 🎯 ONLY consider if at least 2 matches
      if (matches >= 2) {
        winners.push({
          user_id: score.user_id,
          score_id: score.id,
          match_count: matches,
          status: "pending",
        })
      }
    }

    // 🔥 4. STORE RESULTS
    if (winners.length > 0) {
      const { error } = await supabase
        .from("winners")
        .insert(winners)

      if (error) throw error
    }

    return NextResponse.json({
      success: true,
      totalWinners: winners.length,
    })

  } catch (err) {
    console.error("CALC ERROR:", err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}