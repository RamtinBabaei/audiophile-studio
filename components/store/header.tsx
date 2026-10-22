'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { useShop } from './shop-provider';
import { Categories } from './categories';
import { Modal } from './modal';
export const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Headphones', href: '/headphones' },
  { name: 'Speakers', href: '/speakers' },
  { name: 'Earphones', href: '/earphones' },
];
export function Header() {
  const pathname = usePathname();
  const { items, openCart } = useShop();
  const [menu, setMenu] = useState(false);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="site-header">
      <div className="header-inner wrap">
        <button
          className="icon-button menu-toggle"
          aria-label="Open navigation"
          aria-expanded={menu}
          onClick={() => setMenu(true)}
        >
          <Menu size={24} />
        </button>
        <Link className="logo" href="/" aria-label="Audiophile home">
          audiophile
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <button
          className="icon-button cart-toggle"
          aria-label={`Open cart, ${count} items`}
          onClick={openCart}
        >
          <ShoppingCart size={23} strokeWidth={1.7} />
          {count > 0 && <span className="cart-badge">{count}</span>}
        </button>
      </div>
      {menu && (
        <Modal
          label="Mobile navigation"
          onClose={() => setMenu(false)}
          className="navigation-modal"
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="logo" onClick={() => setMenu(false)}>
              audiophile
            </Link>
            <button
              className="icon-button"
              onClick={() => setMenu(false)}
              aria-label="Close navigation"
            >
              <X />
            </button>
          </div>
          <Categories compact onNavigate={() => setMenu(false)} />
        </Modal>
      )}
    </header>
  );
}
