import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { KeepAlive } from '@/components/KeepAlive';

export const metadata: Metadata = {
  title: 'Ayurved Life – Pure · Natural · Authentic',
  description: 'Premium Ayurvedic products for immunity, wellness, and vitality. Rooted in ancient wisdom, crafted for modern living.',
  keywords: 'ayurveda, herbal, ashwagandha, immunity, wellness, natural products india',
  openGraph: {
    title: 'Ayurved Life',
    description: 'Premium Ayurvedic wellness products',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <KeepAlive />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
