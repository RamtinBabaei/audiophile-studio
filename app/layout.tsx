import type { Metadata } from 'next';
import { ShopProvider } from '@/components/store/shop-provider';
import { Header } from '@/components/store/header';
import { Footer } from '@/components/store/footer';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://audiophile-studio-ramtin.shaficp.chatgpt.site',
  ),
  title: {
    default: 'Audiophile — Exceptional sound. No compromises.',
    template: '%s | Audiophile',
  },
  description:
    'Discover premium headphones, speakers, and earphones. A considered collection for people who live for sound.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Audiophile — Exceptional sound',
    description: 'High-fidelity audio. Beautifully crafted.',
    images: ['/assets/home/desktop/image-hero.webp'],
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/manrope-latin.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <ShopProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          {children}
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}
