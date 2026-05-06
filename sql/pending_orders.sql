CREATE TABLE pending_orders (
  session_id text PRIMARY KEY,
  items text,
  created_at timestamptz DEFAULT now()
);
