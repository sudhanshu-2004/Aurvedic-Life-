import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { HeroSection } from '@/components/HeroSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import type { Product } from '@/lib/supabase';
import styles from './page.module.css';

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(6);
  if (error) {
    console.error('Products fetch error:', error.message);
    return [];
  }
  return data ?? [];
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <HeroSection />

      {/* Trust bar */}
      <div className={styles.trustBar}>
        {[
          { icon: '🌿', text: '100% Natural' },
          { icon: '🔬', text: 'Science Backed' },
          { icon: '🇮🇳', text: 'Made in India' },
          { icon: '🚚', text: 'Free Delivery ₹999+' },
          { icon: '↩️', text: '7-Day Returns' },
        ].map(({ icon, text }) => (
          <div key={text} className={styles.trustItem}>
            <span>{icon}</span><span>{text}</span>
          </div>
        ))}
      </div>

      {/* Products */}
      <section className={`${styles.productsSection} section-pad`} id="products">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Our Bestsellers</h2>
            <p className="section-subtitle">
              Handpicked Ayurvedic formulations trusted by thousands for genuine wellness results.
            </p>
          </div>
          {products.length > 0 ? (
            <div className={styles.grid}>
              {products.map((p, i) => (
                <div key={p.id} className={`fade-up fade-up-d${Math.min(i % 3 + 1, 3)}`}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Products loading from Supabase… Add your credentials in <code>.env.local</code> and run the SQL schema.</p>
            </div>
          )}
        </div>
      </section>

      {/* Free Consultation Banner */}
      <section className={styles.consultationBanner}>
        <div className="container">
          <div className={styles.consultationText}>
            <span className={styles.badgeGold}>100% Ayurvedic</span>
            <h2>Kidney Mein Pathri? Dard Bardasht Se Bahar?</h2>
            <p>Bina Operation, Ayurvedic Tarike Se Paayein Rahat</p>
            <div className={styles.ctaBox}>
              <h3>★ FREE Doctor Se Baat Kijiye — Bilkul Muft Salah</h3>
              <button className="btn-primary">FREE Doctor Consultation</button>
            </div>
          </div>
        </div>
      </section>

      <BenefitsSection />

      {/* Testimonials */}
      <section className={`${styles.testimonials} section-pad`} id="testimonials">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real stories from real wellness journeys.</p>
          </div>
          <div className={styles.testimonialGrid}>
            {[
              { name: 'Priya S.', city: 'Mumbai', text: 'The Ashwagandha capsules have completely changed my sleep and energy levels. I feel 10 years younger!', stars: 5 },
              { name: 'Rahul M.', city: 'Delhi', text: 'Started using the Immunity Kit during monsoon. No cold or fever all season. Highly recommend!', stars: 5 },
              { name: 'Anita K.', city: 'Bangalore', text: 'Pure ingredients, fast delivery, and great results. Ayurved Life is now my go-to wellness brand.', stars: 5 },
            ].map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.stars}>{'★'.repeat(t.stars)}</div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.avatar}>{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
