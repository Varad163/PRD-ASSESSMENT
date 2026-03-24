import { supabase } from "@/lib/db"
import { NextResponse } from "next/server"
import { generateRandomDraw, countMatches } from "@/services/draw.service"

export async function POST() {
  // 🔥 1. Generate draw numbers
  const drawNumbers = generateRandomDraw()

  // 🔥 2. Save draw
  const { data: draw } = await supabase
    .from("draws")
    .insert([
      {
        numbers: drawNumbers,
        type: "random",
        status: "published",
        month: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  // 🔥 3. Get all users
  const { data: users } = await supabase.from("users").select("*")

  // 🔥 4. Process each user
  for (const user of users || []) {
    const { data: scores } = await supabase
      .from("scores")
      .select("value")
      .eq("user_id", user.id)

    if (!scores || scores.length === 0) continue

    const userScores = scores.map((s) => s.value)

    const matches = countMatches(userScores, drawNumbers)

    if (matches >= 3) {
      await supabase.from("winners").insert([
        {
          user_id: user.id,
          draw_id: draw.id,
          match_type: matches,
          prize_amount: 0, // we update later
        },
      ])
    }
  }

  return NextResponse.json({
    message: "Draw completed",
    drawNumbers,
  })
}