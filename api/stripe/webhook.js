import Stripe from "stripe"
import { buffer } from "micro"

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const sig = req.headers["stripe-signature"]
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    const rawBody = await buffer(req)
    event = stripe.webhooks.constructEvent(rawBody, sig, secret)
  } catch (err) {
    return res.status(400).json({ error: "Invalid signature" })
  }

  if (event.type === "checkout.session.completed") {
    console.log("Payment confirmed:", event.data.object.id)
  }

  res.json({ received: true })
}
