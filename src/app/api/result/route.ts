import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ✅ Fetch user's results (winners)
    const { data, error } = await supabase
      .from("winners")
      .select(`
        id,
        prize_amount,
        status,
        match_count,
        created_at,
        draws(id, created_at),
        users(email)
      `)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // ✅ Format response (clean UI-friendly)
    const formatted = (data || []).map((w) => {
      const match = w.match_count

      let tier = "No Win"
      if (match === 5) tier = "Jackpot"
      else if (match === 4) tier = "Tier 2"
      else if (match === 3) tier = "Tier 3"

      return {
        id: w.id,
        email: w.users?.[0]?.email || "Unknown",
        drawId: w.draws?.[0]?.id,
        drawDate: w.draws?.[0]?.created_at,
        matches: match,
        tier,
        prize: w.prize_amount,
        status: w.status,
        date: w.created_at,
      }
    })

    return NextResponse.json(formatted)
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}