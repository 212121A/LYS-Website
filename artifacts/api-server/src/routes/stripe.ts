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

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/create-checkout-session", async (req, res) => {
  try {
    const stripe = getStripe();
    const { cartItems } = req.body ?? {};
    const {
      currency = "eur",
      customer = {},
      orderType = "pickup",
      address = {},
      note = "",
      origin,
      metadata: requestMetadata = {},
    } = req.body ?? {};
    const itemsFromBody = Array.isArray(cartItems)
      ? cartItems
      : Array.isArray(req.body?.items)
        ? req.body.items
        : [];

    if (itemsFromBody.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const normalizedOrigin =
      typeof origin === "string" && /^https?:\/\//.test(origin)
        ? origin
        : `${req.protocol}://${req.get("host")}`;

    const lineItems = itemsFromBody
      .filter((item) => item && typeof item.name === "string")
      .map((item) => {
        const rawPrice = Number(item.price);
        const quantity = Math.max(1, Number(item.quantity ?? 1));
        const unitAmount = Math.round(rawPrice * 100);

        if (!Number.isFinite(unitAmount) || unitAmount < 1) {
          throw new Error("Invalid item price");
        }

        const sizeSuffix =
          item.size === "small" || item.size === "large"
            ? ` (${item.size})`
            : "";

        return {
          price_data: {
            currency,
            unit_amount: unitAmount,
            product_data: {
              name: `${item.name}${sizeSuffix}`,
            },
          },
          quantity,
        };
      });

    if (lineItems.length === 0) {
      return res.status(400).json({ error: "No valid items" });
    }

    if (orderType === "delivery") {
      lineItems.push({
        price_data: {
          currency,
          unit_amount: 200,
          product_data: {
            name: "Delivery fee",
          },
        },
        quantity: 1,
      });
    }

    const sessionMetadata = {
      ...requestMetadata,
      customerName:
        requestMetadata.customerName ??
        (typeof customer.name === "string" ? customer.name : "unknown"),
      customerPhone:
        requestMetadata.customerPhone ??
        (typeof customer.phone === "string" ? customer.phone : "unknown"),
      orderType: requestMetadata.orderType ?? String(orderType),
      note: requestMetadata.note ?? (typeof note === "string" ? note : ""),
      address:
        requestMetadata.address ??
        (orderType === "delivery"
          ? JSON.stringify({
              street: address?.street ?? "",
              zip: address?.zip ?? "",
              city: address?.city ?? "",
            })
          : ""),
      items:
        requestMetadata.items ??
        JSON.stringify(
          itemsFromBody.map((item: any) => {
            const number =
              typeof item?.number === "string" ? item.number.trim() : "";
            const baseName =
              typeof item?.name === "string" ? item.name : String(item?.id ?? "");
            const displayName = number ? `${number} ${baseName}` : baseName;
            return {
              id: item?.id,
              number,
              name: displayName,
              quantity: Math.max(1, Number(item?.quantity ?? 1)),
            };
          }),
        ),
      pickup_time: requestMetadata.pickup_time ?? "",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${normalizedOrigin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${normalizedOrigin}/cancel`,
      customer_email:
        typeof customer.email === "string" ? customer.email : undefined,
      metadata: sessionMetadata,
    });

    return res.json({ url: session.url });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/config", (_req, res) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    return res.status(503).json({ error: "Stripe not configured" });
  }
  return res.json({ publishableKey });
});

export default router;
