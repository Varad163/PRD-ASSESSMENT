import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // ✅ 1. Get latest draw
    const { data: draw } = await supabase
      .from("draws")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!draw) {
      return NextResponse.json({ error: "No draw found" }, { status: 400 })
    }

    const drawNumbers = draw.numbers

    // ✅ 2. Get all entries for this draw
    const { data: entries } = await supabase
      .from("draw_entries")
      .select("*")
      .eq("draw_id", draw.id)

    if (!entries || entries.length === 0) {
      return NextResponse.json({ error: "No entries found" }, { status: 400 })
    }

    // ✅ 3. Compare + store scores
    for (const entry of entries) {
      const matches = entry.numbers.filter((num: number) =>
        drawNumbers.includes(num)
      )

      await supabase.from("scores").insert([
        {
          user_id: entry.user_id,
          draw_id: draw.id,
          matched_numbers: matches,
          match_count: matches.length,
        },
      ])
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Failed to calculate scores" },
      { status: 500 }
    )
  }
}