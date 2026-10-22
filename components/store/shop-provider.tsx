'use client';
import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  useRef,
  useEffect,
} from 'react';
import type { CartItem } from '@/lib/shop/checkout';
import { cartStore } from '@/lib/shop/cart-store';
import { Cart } from './cart';
const ShopContext = createContext<{
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  announce: (message: string) => void;
} | null>(null);
export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error('ShopProvider missing');
  return value;
}
export function ShopProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  function announce(message: string) {
    clearTimeout(timer.current);
    setMessage(message);
    timer.current = setTimeout(() => setMessage(''), 3500);
  }
  return (
    <ShopContext.Provider
      value={{ items, openCart: () => setOpen(true), closeCart: () => setOpen(false), announce }}
    >
      {children}
      {open && <Cart onClose={() => setOpen(false)} />}
      <div className={`toast ${message ? 'visible' : ''}`} role="status">
        {message}
      </div>
    </ShopContext.Provider>
  );
}
