'use client';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { cartStore } from '@/lib/shop/cart-store';
import { useShop } from './shop-provider';
import { Quantity } from './quantity';
export function AddToCart({ slug, name }: { slug: string; name: string }) {
  const [quantity, setQuantity] = useState(1);
  const { announce } = useShop();
  return (
    <div className="add-to-cart">
      <Quantity value={quantity} onChange={setQuantity} />
      <button
        className="button button-primary"
        onClick={() => {
          cartStore.add(slug, quantity);
          announce(`${name} added to your cart.`);
        }}
      >
        <ShoppingBag size={16} /> Add to cart
      </button>
    </div>
  );
}
