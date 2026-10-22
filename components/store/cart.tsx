'use client';
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ShoppingBag, X, Trash2 } from 'lucide-react';
import { useShop } from './shop-provider';
import { cartStore } from '@/lib/shop/cart-store';
import { money, shortName, products } from '@/lib/shop/catalog';
import { Quantity } from './quantity';
import { Modal } from './modal';
export function Cart({ onClose }: { onClose: () => void }) {
  const { items } = useShop();
  const total = items.reduce(
    (sum, item) => sum + products.find((p) => p.id === item.productId)!.price * 100 * item.quantity,
    0,
  );
  return (
    <Modal onClose={onClose} label="Shopping cart" className="cart-modal">
      <div className="flex items-center justify-between gap-4">
        <h2>Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})</h2>
        <button className="icon-button" onClick={onClose} aria-label="Close cart">
          <X size={22} />
        </button>
      </div>
      {items.length ? (
        <>
          <button className="text-button remove-all" onClick={() => cartStore.clear()}>
            Remove all
          </button>
          <ul className="cart-lines">
            {items.map((item) => {
              const product = products.find((p) => p.id === item.productId)!;
              return (
                <li key={product.id}>
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    aria-label={`View ${product.name}`}
                  >
                    <img
                      src={`/assets/cart/image-${product.slug}.webp`}
                      width={64}
                      height={64}
                      alt=""
                    />
                  </Link>
                  <div className="cart-line-copy">
                    <strong>{shortName(product.name)}</strong>
                    <span>{money(product.price * 100)}</span>
                    <button
                      className="remove-item"
                      onClick={() => cartStore.set(product.id, 0)}
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                  <Quantity
                    compact
                    label={shortName(product.name)}
                    value={item.quantity}
                    min={0}
                    onChange={(value) => cartStore.set(product.id, value)}
                  />
                </li>
              );
            })}
          </ul>
          <div className="total-row">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          <p className="cart-note">Shipping and VAT shown at checkout.</p>
          <Link href="/checkout" className="button button-primary w-full" onClick={onClose}>
            Checkout
          </Link>
        </>
      ) : (
        <div className="empty-cart">
          <ShoppingBag size={44} strokeWidth={1} />
          <h3>Your next great listen awaits.</h3>
          <p>Explore our collection and find your sound.</p>
          <Link href="/headphones" className="button button-primary" onClick={onClose}>
            Explore headphones
          </Link>
        </div>
      )}
    </Modal>
  );
}
