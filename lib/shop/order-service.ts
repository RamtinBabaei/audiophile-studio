import { checkoutSchema, quoteCart, type Receipt } from './checkout';

export interface StoredOrder {
  fingerprint: string;
  receipt: Receipt;
}
export interface OrderRepository {
  insertIfAbsent(
    key: string,
    fingerprint: string,
    customer: string,
    receipt: Receipt,
  ): Promise<void>;
  findByKey(key: string): Promise<StoredOrder | undefined>;
}
export class IdempotencyConflict extends Error {}

export async function placeOrder(
  payload: unknown,
  key: string,
  repository: OrderRepository,
): Promise<Receipt> {
  const data = checkoutSchema.parse(payload);
  // Demo payment credentials are validated and discarded, never stored or logged.
  const canonical = JSON.stringify({
    customer: data.customer,
    items: [...data.items].sort((a, b) => a.productId - b.productId),
    method: data.payment.method,
  });
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical));
  const fingerprint = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  const receipt: Receipt = {
    ...quoteCart(data.items),
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    paymentMethod: data.payment.method,
    mode: 'demo',
  };
  await repository.insertIfAbsent(key, fingerprint, JSON.stringify(data.customer), receipt);
  const saved = await repository.findByKey(key);
  if (!saved) throw new Error('Order could not be saved.');
  if (saved.fingerprint !== fingerprint)
    throw new IdempotencyConflict('This checkout has changed. Please try again.');
  return saved.receipt;
}
