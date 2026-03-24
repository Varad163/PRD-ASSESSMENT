import { supabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const { data, error } = await supabase
    .from("winners")
    .select("*, users(email), draws(numbers)")
    .order("created_at", { ascending: false })

  return NextResponse.json({ data, error })
}