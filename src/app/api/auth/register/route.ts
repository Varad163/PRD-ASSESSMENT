import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseServer"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  console.log("REGISTER API HIT 🚀")

  try {
    const { email, password } = await req.json()

    // ✅ Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // ✅ Check if user already exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (fetchError) {
      console.log("FETCH ERROR:", fetchError)
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // ✅ Insert user
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
        },
      ])
      .select()

    if (error) {
      console.log("INSERT ERROR:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: data[0],
      },
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