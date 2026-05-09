import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/supabase';
import styles from './page.module.css';

async function getProducts(): Promise<Product[]> {
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  return data ?? [];
}

export const metadata = {
  title: 'All Products – Ayurved Life',
  description: 'Browse our full range of premium Ayurvedic products.',
};

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <h1>Our Products</h1>
          <p>Discover the full range of Ayurvedic formulations crafted for your wellness journey.</p>
        </div>
      </div>
      <div className="container section-pad">
        {products.length === 0 ? (
          <div className={styles.empty}>
            <p>⚠️ No products found. Make sure your Supabase credentials are set in <code>.env.local</code> and the SQL schema has been executed.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
