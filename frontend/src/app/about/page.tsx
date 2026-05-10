import Link from 'next/link';

export const metadata = { title: 'About Us – Ayurved Life' };

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '60vh', backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: 'var(--green-dark)', fontSize: '3rem', textAlign: 'center', marginBottom: '20px' }}>Our Story</h1>
        <div style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '20px' }}>Ayurved Life was founded with a single purpose: to bring the ancient, time-tested wisdom of Ayurveda to the modern world in its purest form. In an era dominated by synthetic chemicals and quick fixes, we believe in the healing power of nature.</p>
          <p style={{ marginBottom: '20px' }}>Every product we create is rooted in authentic Ayurvedic texts, carefully formulating herbs and natural ingredients to restore balance to the mind, body, and spirit. We source our ingredients from organic farms across India, ensuring that only the highest quality herbs make it into our supplements.</p>
          <p style={{ marginBottom: '20px' }}><strong>The Soul of Ayurveda:</strong> We don't just sell products; we promote a holistic lifestyle. Our mission is to empower you to take control of your health naturally, without side effects.</p>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/products" style={{ display: 'inline-block', background: 'var(--green-primary)', color: 'white', padding: '12px 30px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Explore Our Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
