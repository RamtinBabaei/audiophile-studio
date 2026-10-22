import { describe, it, expect } from 'vitest';
import { checkoutSchema, quoteCart } from '@/lib/shop/checkout';
import { sanitizeCart } from '@/lib/shop/cart-store';
import { products } from '@/lib/shop/catalog';
export const validCheckout = {
  customer: {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 202 555 0146',
    address: '1137 Williams Avenue',
    zip: '10001',
    city: 'New York',
    country: 'United States',
  },
  items: [{ productId: 4, quantity: 2 }],
  payment: { method: 'cash' as const },
};
describe('server pricing and checkout validation', () => {
  it('uses authoritative prices, flat shipping, and included VAT', () => {
    const product = products.find((p) => p.slug === 'xx99-mark-two-headphones')!;
    const quote = quoteCart([{ productId: product.id, quantity: 2 }]);
    expect(quote.subtotal).toBe(599800);
    expect(quote.shipping).toBe(5000);
    expect(quote.vat).toBe(119960);
    expect(quote.grandTotal).toBe(604800);
  });
  it.each<unknown>([
    [],
    [{ productId: 999, quantity: 1 }],
    [{ productId: 1, quantity: 0 }],
    [{ productId: 1, quantity: 100 }],
    [{ productId: 1, quantity: 1.5 }],
    [
      { productId: 1, quantity: 1 },
      { productId: 1, quantity: 2 },
    ],
    [{ productId: 1, quantity: 1, price: 1 }],
  ])('rejects invalid cart %j', (items) => {
    expect(() => quoteCart(items)).toThrow();
  });
  it('rejects invalid email and missing shipping address', () => {
    const result = checkoutSchema.safeParse({
      ...validCheckout,
      customer: { ...validCheckout.customer, email: 'bad', address: '' },
    });
    expect(result.success).toBe(false);
  });
  it('conditionally validates demo e-money credentials', () => {
    expect(
      checkoutSchema.safeParse({
        ...validCheckout,
        payment: { method: 'e-money', number: '123', pin: '12' },
      }).success,
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({
        ...validCheckout,
        payment: { method: 'e-money', number: '123456789', pin: '1234' },
      }).success,
    ).toBe(true);
  });
  it('sanitizes corrupted storage, merges duplicates, clamps quantities', () => {
    expect(sanitizeCart('corrupt')).toEqual([]);
    expect(
      sanitizeCart([
        { productId: 1, quantity: 80 },
        { productId: 1, quantity: 60 },
        { productId: 999, quantity: 2 },
        { productId: 2, quantity: -1 },
      ]),
    ).toEqual([{ productId: 1, quantity: 99 }]);
  });
});
