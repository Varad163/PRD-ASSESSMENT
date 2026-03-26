import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("winners")
      .select(`
        user_id,
        prize_amount,
        users ( email )
      `)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 🔥 group by user
    const leaderboard: any = {}
for (const w of data || []) {
  const email = w.users?.[0]?.email || "Unknown"

  if (!leaderboard[email]) {
    leaderboard[email] = {
      email,
      total: 0,
      wins: 0,
    }
  }

  leaderboard[email].total += w.prize_amount
  leaderboard[email].wins += 1
}
    // 🔥 convert + sort
    const result = Object.values(leaderboard).sort(
      (a: any, b: any) => b.total - a.total
    )

    return NextResponse.json({ data: result })

  } catch (err) {
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}