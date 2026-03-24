import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { supabaseAdmin } from "@/lib/supabaseServer"

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover", // ✅ FIXED
})

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
    const sig = headersList.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.log("❌ Signature error:", err)
    return new NextResponse("Webhook Error", { status: 400 })
  }

  console.log("✅ EVENT:", event.type)

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.userId
    const plan = session.metadata?.plan

    console.log("🔥 METADATA:", session.metadata)

    // ❌ STOP if missing
    if (!userId) {
      console.log("❌ userId missing")
      return NextResponse.json({ error: "No userId" })
    }

    const { error } = await supabaseAdmin
      .from("subscriptions")
      .insert([
        {
          user_id: userId, // must be valid UUID
          plan,
          status: "active",
        },
      ])

    if (error) {
      console.log("❌ DB ERROR:", error)
    } else {
      console.log("✅ Subscription saved!")
    }
  }

  return NextResponse.json({ received: true })
}