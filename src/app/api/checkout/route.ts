import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { plan } = await req.json()

  const price =
    plan === "monthly"
      ? 500 // ₹500 example
      : 5000 // yearly

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

    success_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    cancel_url: `${process.env.NEXTAUTH_URL}/`,
  })

  return NextResponse.json({ url: session.url })
}