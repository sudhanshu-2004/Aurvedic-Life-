import styles from './BenefitsSection.module.css';

const benefits = [
  { icon: '🌱', title: 'Pure Ingredients', desc: 'No fillers, no additives. Every product uses certified organic herbs sourced directly from farmers.' },
  { icon: '🔬', title: 'Science Backed', desc: 'Formulations validated by Ayurvedic experts and tested for purity, potency, and safety.' },
  { icon: '🐾', title: 'Cruelty Free', desc: 'All products are 100% cruelty-free. We never test on animals, ever.' },
  { icon: '♻️', title: 'Eco Packaging', desc: 'Biodegradable packaging that\'s as kind to the planet as our products are to your body.' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Free shipping on orders above ₹999. Delivered fresh within 3-5 business days across India.' },
  { icon: '↩️', title: '7-Day Returns', desc: 'Not satisfied? Return within 7 days for a full refund — no questions asked.' },
];

export function BenefitsSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className="text-center">
          <h2 className="section-title">Why Choose Ayurved Life?</h2>
          <p className="section-subtitle">Every decision we make is guided by one principle — your genuine wellbeing.</p>
        </div>
        <div className={styles.grid}>
          {benefits.map((b, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.icon}>{b.icon}</div>
              <h3 className={styles.title}>{b.title}</h3>
              <p className={styles.desc}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
