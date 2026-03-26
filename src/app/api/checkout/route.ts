import Stripe from "stripe"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const plan = body.plan

  const price =
    plan === "yearly" ? 500000 : 50000

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `Golf ${plan} Subscription`,
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],

    // 🔥 IMPORTANT
    metadata: {
      userId: session.user.id,
      plan,
    },

    success_url: "http://localhost:3000/dashboard",
    cancel_url: "http://localhost:3000/dashboard",
  })

  return NextResponse.json({ url: stripeSession.url })
}