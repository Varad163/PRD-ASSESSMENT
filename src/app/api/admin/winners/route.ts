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

  // 🔒 only admin allowed
  if (session?.user.role !== "admin") {
    return NextResponse.json([], { status: 403 })
  }

  const { data } = await supabase
    .from("results")
    .select("*")
    .in("tier", ["jackpot", "tier2", "tier3"])

  return NextResponse.json(data)
}