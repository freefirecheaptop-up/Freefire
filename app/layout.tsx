import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DIAMOND X STORE | Free Fire Diamond Top-Up - 50% OFF Instant UID',
  description: 'Official authorized Free Fire Diamond Top-Up store. Instant direct UID credit, genuine 50% discount deals, secure Razorpay UPI & card payments, and live order tracking.',
  openGraph: {
    title: 'DIAMOND X STORE | Free Fire Diamond Top-Up - 50% OFF Instant UID',
    description: 'Get Free Fire diamonds for less! Instant UID direct delivery, 50% discount offers, secure payment gateway, and 24/7 gamer support.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DIAMOND X STORE | Free Fire Diamond Top-Up - 50% OFF',
    description: 'Official authorized Free Fire Diamond Top-Up store with instant UID delivery and 50% discount.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#07080e] text-slate-100 antialiased selection:bg-[#e6ff00] selection:text-black">
        {children}
      </body>
    </html>
  );
}
