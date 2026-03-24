import { supabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { value, played_at } = await req.json()

  if (value < 1 || value > 45) {
    return NextResponse.json({ error: "Invalid score" }, { status: 400 })
  }

  // 🔥 1. Get existing scores
  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", session.user.id)
    .order("played_at", { ascending: true }) // oldest first

  // 🔥 2. If already 5 → delete oldest
  if (scores && scores.length >= 5) {
    const oldest = scores[0]

    await supabase
      .from("scores")
      .delete()
      .eq("id", oldest.id)
  }

  // 🔥 3. Insert new score
  const { data, error } = await supabase
    .from("scores")
    .insert([
      {
        user_id: session.user.id,
        value,
        played_at,
      },
    ])

  return NextResponse.json({ data, error })
}
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", session.user.id)
    .order("played_at", { ascending: false }) // latest first

  return NextResponse.json({ scores: data })
}