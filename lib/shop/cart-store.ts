import { getProduct, products } from './catalog';
import type { CartItem } from './checkout';

export const CART_KEY = 'audiophile.cart.v1';
const EMPTY: CartItem[] = [];
let snapshot: CartItem[] = EMPTY;
const listeners = new Set<() => void>();

export function sanitizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const merged = new Map<number, number>();
  for (const item of value) {
    if (
      item &&
      typeof item === 'object' &&
      Number.isInteger(item.productId) &&
      products.some((p) => p.id === item.productId) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    ) {
      merged.set(item.productId, Math.min(99, (merged.get(item.productId) ?? 0) + item.quantity));
    }
  }
  return Array.from(merged, ([productId, quantity]) => ({ productId, quantity }));
}
function read() {
  try {
    return sanitizeCart(JSON.parse(localStorage.getItem(CART_KEY) ?? '[]'));
  } catch {
    return [];
  }
}
function emit() {
  listeners.forEach((listener) => listener());
}
function update(items: CartItem[]) {
  snapshot = sanitizeCart(items);
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(snapshot));
  } catch {
    /* Cart remains usable in memory when storage is disabled. */
  }
  emit();
}
export const cartStore = {
  subscribe(listener: () => void) {
    if (!listeners.size) snapshot = read();
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_KEY || event.key === null) {
        snapshot = read();
        emit();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  },
  getSnapshot: () => snapshot,
  getServerSnapshot: () => EMPTY,
  add(slug: string, quantity: number) {
    const product = getProduct(slug);
    if (!product || !Number.isInteger(quantity) || quantity < 1) return;
    const previous = snapshot.find((item) => item.productId === product.id);
    update([
      ...snapshot.filter((item) => item.productId !== product.id),
      { productId: product.id, quantity: Math.min(99, quantity + (previous?.quantity ?? 0)) },
    ]);
  },
  set(productId: number, quantity: number) {
    update(
      quantity <= 0
        ? snapshot.filter((item) => item.productId !== productId)
        : snapshot.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
  },
  clear: () => update([]),
};
