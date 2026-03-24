import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseServer"

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select(`
      id,
      plan,
      status,
      user_id,
      users (
        email
      )
    `)

  if (error) {
    console.log("ERROR:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}