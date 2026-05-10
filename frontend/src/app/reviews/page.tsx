export const metadata = { title: 'Reviews – Ayurved Life' };

export default function ReviewsPage() {
  const reviews = [
    { name: "Rahul Sharma", product: "Liver Care", rating: 5, text: "I've been using Liver Care for 2 months now and the results are amazing. My digestion has improved and I feel much more energetic. Completely herbal and safe!" },
    { name: "Priya Patel", product: "Hair Growth", rating: 5, text: "Finally an Ayurvedic product that actually works for hair fall. I noticed a significant reduction in hair loss within just 3 weeks of starting this supplement." },
    { name: "Amit Verma", product: "Brain Booster", rating: 4, text: "Great product for focus. As a software developer, I need to concentrate for long hours, and Brahmi has really helped clear my brain fog." },
    { name: "Sneha Reddy", product: "Weight Loss", rating: 5, text: "Combined with a good diet, this supplement has accelerated my weight loss journey without giving me the jitters that other fat burners do." },
    { name: "Vikram Singh", product: "Joint Pain", rating: 5, text: "My mother has been taking the Joint Pain supplement for a month and her knee pain has reduced drastically. Very thankful for this authentic product." },
    { name: "Anjali Gupta", product: "Pathrii Mukti", rating: 5, text: "Saved me from severe kidney stone pain. Passed the stone naturally within a few weeks of starting this course. Highly recommended." }
  ];

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '60vh', backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: 'var(--green-dark)', fontSize: '3rem', textAlign: 'center', marginBottom: '40px' }}>Customer Reviews</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--gold-primary)', fontSize: '1.2rem', marginBottom: '10px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px' }}>"{r.text}"</p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                <strong style={{ color: 'var(--text-dark)' }}>{r.name}</strong>
                <div style={{ color: 'var(--green-medium)', fontSize: '0.85rem', marginTop: '5px' }}>Verified Buyer – {r.product}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
