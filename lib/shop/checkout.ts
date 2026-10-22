import { z } from 'zod';
import { products } from './catalog';

export const cartSchema = z
  .array(
    z
      .object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(99),
      })
      .strict(),
  )
  .min(1, 'Your cart is empty.')
  .max(6)
  .superRefine((items, ctx) => {
    const seen = new Set<number>();
    items.forEach((item, i) => {
      if (!products.some((p) => p.id === item.productId))
        ctx.addIssue({
          code: 'custom',
          message: 'Product is unavailable.',
          path: [i, 'productId'],
        });
      if (seen.has(item.productId))
        ctx.addIssue({ code: 'custom', message: 'Duplicate product.', path: [i, 'productId'] });
      seen.add(item.productId);
    });
  });
const required = (label: string, max = 100) =>
  z.string().trim().min(2, `${label} is required.`).max(max);
export const customerSchema = z
  .object({
    name: required('Name'),
    email: z.string().trim().email('Enter a valid email address.').max(254),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[\d\s().-]{7,25}$/, 'Enter a valid phone number.'),
    address: required('Address', 200),
    zip: z.string().trim().min(2, 'ZIP / postal code is required.').max(20),
    city: required('City'),
    country: required('Country'),
  })
  .strict();
const paymentSchema = z.discriminatedUnion('method', [
  z
    .object({
      method: z.literal('e-money'),
      number: z.string().regex(/^\d{9}$/, 'Use a 9-digit demo number.'),
      pin: z.string().regex(/^\d{4}$/, 'Use a 4-digit demo PIN.'),
    })
    .strict(),
  z.object({ method: z.literal('cash') }).strict(),
]);
export const checkoutSchema = z
  .object({ customer: customerSchema, items: cartSchema, payment: paymentSchema })
  .strict();
export type CartItem = z.infer<typeof cartSchema>[number];
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export interface QuoteLine extends CartItem {
  name: string;
  slug: string;
  unitPrice: number;
  lineTotal: number;
}
export interface Quote {
  items: QuoteLine[];
  subtotal: number;
  shipping: number;
  vat: number;
  grandTotal: number;
}
export interface Receipt extends Quote {
  id: string;
  createdAt: string;
  paymentMethod: 'e-money' | 'cash';
  mode: 'demo';
}

/** Integer cents throughout. Challenge prices include VAT; VAT is displayed, not charged twice. */
export function quoteCart(input: unknown): Quote {
  const items = cartSchema.parse(input).map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const unitPrice = Math.round(product.price * 100);
    return {
      ...item,
      name: product.name,
      slug: product.slug,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return {
    items,
    subtotal,
    shipping: 5000,
    vat: Math.round(subtotal * 0.2),
    grandTotal: subtotal + 5000,
  };
}
