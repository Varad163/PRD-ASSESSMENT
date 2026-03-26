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
      return NextResponse.json({ active: false })
    }

    // ✅ filter by current user
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", session.user.id) // 🔥 IMPORTANT
      .maybeSingle()

    if (error) {
      return NextResponse.json({ active: false })
    }

    return NextResponse.json({
      active: !!data, // true if exists
    })

  } catch (err) {
    return NextResponse.json({ active: false })
  }
}