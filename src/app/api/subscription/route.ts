import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// ✅ Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 🔹 GET → used by dashboard
export async function GET() {
  try {
    // 👉 TODO: replace with real user logic
    // for now returning dummy active = true

    const active = true

    return NextResponse.json({ active })
  } catch (err) {
    console.error("GET /api/subscription error:", err)

    return NextResponse.json(
      { active: false },
      { status: 500 }
    )
  }
}

// 🔹 POST → (optional, if you want to update subscription)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { user_id, active } = body

    // example table: subscriptions
    const { error } = await supabase
      .from("subscriptions")
      .upsert([
        {
          user_id,
          active,
        },
      ])

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("POST /api/subscription error:", err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}