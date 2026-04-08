import { Router } from "express";
import Stripe from "stripe";

const router = Router();

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key, { apiVersion: "2025-03-31.basil" });
}

router.post("/create-payment-intent", async (req, res) => {
  try {
    const stripe = getStripe();
    const { amount, currency = "eur", metadata = {} } = req.body;

    if (!amount || typeof amount !== "number" || amount < 50) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/config", (_req, res) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    return res.status(503).json({ error: "Stripe not configured" });
  }
  res.json({ publishableKey });
});

export default router;
