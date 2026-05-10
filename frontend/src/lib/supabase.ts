import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ── Keep-Alive Ping ──────────────────────────────────────────────────────────
// Pings Supabase every 4 minutes to prevent the free-tier project from pausing.
// Only runs on the client side.
let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

export function startSupabaseKeepAlive() {
  if (typeof window === 'undefined') return; // server-side guard
  if (keepAliveInterval) return;             // already running

  const ping = async () => {
    try {
      // Lightweight query – just checks connectivity, returns nothing meaningful
      await supabase.from('products').select('id').limit(1);
      console.debug('[Supabase Keep-Alive] ping ✓', new Date().toLocaleTimeString());
    } catch {
      console.warn('[Supabase Keep-Alive] ping failed – server may be paused');
    }
  };

  // Immediate ping on start, then every 4 minutes
  ping();
  keepAliveInterval = setInterval(ping, 4 * 60 * 1000);
}

export function stopSupabaseKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
}

// ── Database Types ─────────────────────────────────────────────────────────
export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  gender: string;
  avatar_url: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  badge: string;
  image_url: string | null;
  category: string;
  in_stock: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  delivery_charge: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'razorpay' | 'cod';
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  delivery_name: string;
  delivery_phone: string;
  delivery_address: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_name: string;
  price: number;
  quantity: number;
};
