import { supabase } from "@/lib/db"
import {
  calculatePrizePool,
  splitPrizePool,
} from "@/services/prize.service"

// 🔥 AFTER processing winners

// 1. Get total subscribers
const { data: subs, error: subsError } = await supabase
  .from("subscriptions")
  .select("*")
  .eq("status", "active")

if (subsError) {
  console.log("Subscription fetch error:", subsError)
}

// ✅ FIXED length
const totalUsers = subs?.length || 0

// Assume ₹500 (can improve later)
const totalPool = calculatePrizePool(totalUsers, 500)

const { tier5, tier4, tier3 } = splitPrizePool(totalPool)

// 2. Get the latest draw (or specify how to get the correct draw)
const { data: drawData, error: drawError } = await supabase
  .from("draws")
  .select("*")
  .order("created_at", { ascending: false })
  .limit(1)
  .single()

if (drawError || !drawData) {
  console.log("Draw fetch error:", drawError)
  throw new Error("No draw found")
}

const draw = drawData

// 2. Get winners by type
const { data: winners, error: winnersError } = await supabase
  .from("winners")
  .select("*")
  .eq("draw_id", draw.id)

if (winnersError) {
  console.log("Winners fetch error:", winnersError)
}

// ✅ prevent crash
const safeWinners = winners || []

const tier5Winners = safeWinners.filter((w) => w.match_type === 5)
const tier4Winners = safeWinners.filter((w) => w.match_type === 4)
const tier3Winners = safeWinners.filter((w) => w.match_type === 3)

// 3. Distribute prizes
async function distribute(winnersArr: any[], pool: number) {
  if (!winnersArr || winnersArr.length === 0) return

  const amount = pool / winnersArr.length

  for (const w of winnersArr) {
    const { error } = await supabase
      .from("winners")
      .update({ prize_amount: amount })
      .eq("id", w.id)

    if (error) {
      console.log("Update error:", error)
    }
  }
}

// 🔥 Run distribution
await distribute(tier5Winners, tier5)
await distribute(tier4Winners, tier4)
await distribute(tier3Winners, tier3)