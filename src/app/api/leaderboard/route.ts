import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("winners")
    .select(`
      user_id,
      prize_amount,
      users(email)
    `)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 🔥 GROUPING LOGIC
  const leaderboard: Record<string, any> = {}

  data.forEach((w: any) => {
    const id = w.user_id

    if (!leaderboard[id]) {
      leaderboard[id] = {
        email: w.users?.email || "Unknown",
        wins: 0,
        total: 0,
      }
    }

    leaderboard[id].wins += 1
    leaderboard[id].total += w.prize_amount || 0
  })

  const result = Object.values(leaderboard).sort(
    (a: any, b: any) => b.total - a.total
  )

  return NextResponse.json({ data: result })
}