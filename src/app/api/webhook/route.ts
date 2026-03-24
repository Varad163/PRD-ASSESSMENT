import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.text()

  const sig = req.headers.get("stripe-signature")!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }

  // handle success payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    // TODO: update subscription in DB
    console.log("Payment successful:", session)
  }

  return NextResponse.json({ received: true })
}