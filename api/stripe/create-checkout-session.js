import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY not set");
  }
  return new Stripe(key, { apiVersion: "2025-03-31.basil" });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

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
        : `https://${req.headers.host}`;

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
      items: requestMetadata.items ?? JSON.stringify(itemsFromBody),
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

    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error?.message ?? "Stripe error" });
  }
}
