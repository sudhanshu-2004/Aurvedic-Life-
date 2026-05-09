-- ═══════════════════════════════════════════════════════════════════════════
-- AYURVED LIFE — Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles (extends auth.users) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name    TEXT DEFAULT '',
  last_name     TEXT DEFAULT '',
  phone         TEXT DEFAULT '',
  gender        TEXT DEFAULT '',
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Products ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name           TEXT NOT NULL,
  description    TEXT DEFAULT '',
  price          NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2) NOT NULL,
  badge          TEXT DEFAULT '',
  image_url      TEXT,
  category       TEXT DEFAULT 'general',
  in_stock       BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (TRUE);

-- ── Orders ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id                   UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id              UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount         NUMERIC(10,2) NOT NULL,
  delivery_charge      NUMERIC(6,2)  DEFAULT 0,
  status               TEXT          DEFAULT 'pending'
                         CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  payment_method       TEXT          NOT NULL
                         CHECK (payment_method IN ('razorpay','cod')),
  razorpay_order_id    TEXT DEFAULT '',
  razorpay_payment_id  TEXT DEFAULT '',
  delivery_name        TEXT DEFAULT '',
  delivery_phone       TEXT DEFAULT '',
  delivery_address     TEXT DEFAULT '',
  created_at           TIMESTAMPTZ   DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders"   ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- ── Order Items ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id     UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  price        NUMERIC(8,2) NOT NULL,
  quantity     INTEGER DEFAULT 1
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM public.orders WHERE id = order_id));
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.orders WHERE id = order_id));

-- ── Seed Products ─────────────────────────────────────────────────────────
INSERT INTO public.products (name, description, price, original_price, badge, category) VALUES
  ('Ashwagandha Gold Capsules', 'Premium KSM-66 Ashwagandha for stress relief, stamina, and vitality.', 499, 799, 'Best Seller', 'immunity'),
  ('Triphala + Giloy Immunity Kit', 'A powerful detox and immunity duo rooted in ancient Ayurvedic wisdom.', 890, 1490, 'Combo Pack', 'immunity'),
  ('Brahmi Mind Booster', 'Enhances memory, focus, and cognitive clarity with pure Brahmi extract.', 349, 599, 'New', 'brain'),
  ('Neem Karela Detox Juice', '100% natural blood purifier and liver cleanser, no preservatives.', 299, 499, 'Organic', 'detox'),
  ('Shilajit Resin (Pure)', 'Authentic Himalayan Shilajit for energy, testosterone, and longevity.', 799, 1299, 'Premium', 'energy'),
  ('Turmeric Curcumin + Piperine', 'High-absorption turmeric formula for joint health and inflammation.', 449, 699, 'Sale', 'joints')
ON CONFLICT DO NOTHING;

-- ── Storage Bucket for Avatars ────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', TRUE) ON CONFLICT DO NOTHING;

CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth users can upload avatars" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
