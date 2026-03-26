import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const session = await getServerSession(authOptions)

  // 🔒 Only admin allowed
  if (session?.user.role !== "admin") {
    return NextResponse.json([], { status: 403 })
  }

  const { data, error } = await supabase
    .from("winners")
    .select(`
      *,
      users (
        email
      )
    `)

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 🎯 Add tier dynamically
  const formatted = data.map((w: any) => {
    let tier = ""

    if (w.match_count === 5) tier = "🏆 Jackpot"
    else if (w.match_count === 4) tier = "🥈 Tier 2"
    else if (w.match_count === 3) tier = "🥉 Tier 3"

    return { ...w, tier }
  })

  return NextResponse.json({ data: formatted })
}