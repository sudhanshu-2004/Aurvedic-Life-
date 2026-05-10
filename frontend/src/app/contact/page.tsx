'use client';

export default function ContactPage() {
  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '60vh', backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: 'var(--green-dark)', fontSize: '3rem', textAlign: 'center', marginBottom: '20px' }}>Contact Us</h1>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          
          <div>
            <h3 style={{ color: 'var(--green-dark)', marginBottom: '15px', fontSize: '1.5rem', fontFamily: '"Cormorant Garamond", serif' }}>Get In Touch</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.6' }}>We are here to help you on your wellness journey. Reach out to us for product inquiries, consultations, or support.</p>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ display: 'block', color: 'var(--text-dark)', marginBottom: '5px' }}>Phone / WhatsApp:</strong>
              <a href="https://wa.me/919625976683" style={{ color: 'var(--green-primary)', textDecoration: 'none', fontWeight: 'bold' }}>+91 96259 76683</a>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ display: 'block', color: 'var(--text-dark)', marginBottom: '5px' }}>Email:</strong>
              <a href="mailto:support@ayurvedlife.com" style={{ color: 'var(--green-primary)', textDecoration: 'none' }}>support@ayurvedlife.com</a>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ display: 'block', color: 'var(--text-dark)', marginBottom: '5px' }}>Headquarters:</strong>
              <span style={{ color: 'var(--text-muted)' }}>New Delhi, India</span>
            </div>
          </div>
          
          <div>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={(e) => { e.preventDefault(); alert('Thanks for reaching out! We will contact you soon.'); }}>
              <input type="text" required placeholder="Your Name" style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'inherit', outlineColor: 'var(--green-primary)' }} />
              <input type="email" required placeholder="Your Email" style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'inherit', outlineColor: 'var(--green-primary)' }} />
              <textarea required placeholder="Your Message" rows={4} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'inherit', resize: 'vertical', outlineColor: 'var(--green-primary)' }}></textarea>
              <button type="submit" style={{ background: 'var(--green-primary)', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--green-dark)'} onMouseOut={e => e.currentTarget.style.background = 'var(--green-primary)'}>Send Message</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
