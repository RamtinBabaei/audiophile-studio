import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <Link className="logo" href="/">
            audiophile
          </Link>
          <nav aria-label="Footer navigation">
            {['Home', 'Headphones', 'Speakers', 'Earphones'].map((name) => (
              <Link key={name} href={name === 'Home' ? '/' : `/${name.toLowerCase()}`}>
                {name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="footer-middle">
          <p>
            Audiophile is an all in one stop to fulfill your audio needs. We’re a small team of
            music lovers and sound specialists who are devoted to helping you get the most out of
            personal audio. Come and visit our demo facility — we’re open 7 days a week.
          </p>
          <Link className="footer-contact" href="/headphones">
            Explore the collection <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="footer-bottom">
          <p>Copyright {new Date().getFullYear()}. All rights reserved.</p>
          <p>
            Design by{' '}
            <a
              href="https://www.frontendmentor.io/challenges/audiophile-ecommerce-website-C8cuSd_wx"
              target="_blank"
              rel="noreferrer"
            >
              Frontend Mentor
            </a>{' '}
            · Built by Ramtin Babae
          </p>
        </div>
      </div>
    </footer>
  );
}
