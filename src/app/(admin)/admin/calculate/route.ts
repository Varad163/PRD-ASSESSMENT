import { supabase } from "@/lib/supabase"

function getPercentage(matches: number) {
  if (matches === 5) return 0.5
  if (matches === 4) return 0.3
  if (matches === 3) return 0.2
  return 0
}

export async function POST() {
  try {
    // 🔥 1. get latest draw
    const { data: draw } = await supabase
      .from("draws")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!draw) {
      return Response.json({ error: "No draw found" }, { status: 404 })
    }

    const drawNumbers = draw.numbers

    // 🔥 2. get scores
    const { data: scoresData } = await supabase.from("scores").select("*")
    const scores = scoresData || []

    // 🔥 3. get total pool
   const { data: subsData } = await supabase.from("subscriptions").select("*")
const subs = subsData || []

    const totalPool = subs.length * 100 // 💰

    // 🔥 4. classify winners
    const groups: Record<number, any[]> = {
      5: [],
      4: [],
      3: [],
    }

    for (const s of scores) {
      const matches = s.values.filter((n: number) =>
        drawNumbers.includes(n)
      ).length

      if (matches >= 3) {
        groups[matches].push(s)
      }
    }

    const winners: any[] = []

    // 🔥 5. distribute money
    for (const match of [5, 4, 3]) {
      const group = groups[match]
      if (!group || group.length === 0) continue

      const percentage = getPercentage(match)
      const totalPrize = totalPool * percentage
      const perUserPrize = totalPrize / group.length

      for (const user of group) {
        winners.push({
          user_id: user.user_id,
          score_id: user.id,
          match_count: match,
          prize_amount: Math.floor(perUserPrize),
          status: "pending",
        })
      }
    }

    // 🔥 6. insert winners
    if (winners.length > 0) {
      await supabase.from("winners").insert(winners)
    }

    return Response.json({
      success: true,
      totalPool,
      winners: winners.length,
    })

  } catch (err) {
    console.error(err)
    return Response.json({ error: "failed" }, { status: 500 })
  }
}