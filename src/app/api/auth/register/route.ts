import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseServer"

export async function POST(req: Request) {
  console.log("REGISTER API HIT 🚀")

  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // ✅ Check if user exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (fetchError) {
      console.log("FETCH ERROR:", fetchError)
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // ✅ Insert user
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert([{ email, password }])
      .select()

    if (error) {
      console.log("INSERT ERROR:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "User created", user: data[0] },
      { status: 200 }
    )
  } catch (err) {
    console.log("SERVER CRASH:", err)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}