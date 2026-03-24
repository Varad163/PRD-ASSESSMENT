import { supabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { id } = await req.json()

  const { error } = await supabase
    .from("winners")
    .update({ status: "paid" })
    .eq("id", id)

  return NextResponse.json({ success: true, error })
}