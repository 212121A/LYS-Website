-- Adds Stripe session mapping for order lookup on /success page.
ALTER TABLE IF EXISTS public.orders
ADD COLUMN IF NOT EXISTS stripe_session_id text;

CREATE INDEX IF NOT EXISTS orders_stripe_session_id_idx
ON public.orders (stripe_session_id);
