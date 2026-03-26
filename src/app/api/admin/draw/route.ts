import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const numbers = body.numbers

    // ✅ validation
    if (!numbers || numbers.length !== 5) {
      return NextResponse.json(
        { error: "Select exactly 5 numbers" },
        { status: 400 }
      )
    }

    if (new Set(numbers).size !== 5) {
      return NextResponse.json(
        { error: "Duplicate numbers not allowed" },
        { status: 400 }
      )
    }

    if (numbers.some((n: number) => n < 1 || n > 45)) {
      return NextResponse.json(
        { error: "Numbers must be 1–45" },
        { status: 400 }
      )
    }

    // 🔥 INSERT INTO DRAWS
    const { error } = await supabase.from("draws").insert([
      {
        numbers: numbers,
        status: "published",
      },
    ])

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Draw stored in DB",
    })

  } catch (err) {
    console.error("DRAW ERROR:", err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}