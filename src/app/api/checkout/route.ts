import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { plan, userId } = await req.json()

  const price = plan === "monthly" ? 500 : 5000

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `Golf Subscription (${plan})`,
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ],

    // 🔥 IMPORTANT PART
    metadata: {
      userId,
      plan,
    },

    success_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    cancel_url: `${process.env.NEXTAUTH_URL}/`,
  })

  return NextResponse.json({ url: session.url })
}
