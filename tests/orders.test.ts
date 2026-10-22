import { describe, it, expect, vi } from 'vitest';
import {
  placeOrder,
  IdempotencyConflict,
  type OrderRepository,
  type StoredOrder,
} from '@/lib/shop/order-service';
import { validCheckout } from './fixtures';
function repository() {
  const data = new Map<string, StoredOrder>();
  return {
    data,
    insertIfAbsent: vi.fn(async (key, fingerprint, _customer, receipt) => {
      if (!data.has(key)) data.set(key, { fingerprint, receipt });
    }),
    findByKey: vi.fn(async (key) => data.get(key)),
  } satisfies OrderRepository & { data: Map<string, StoredOrder> };
}
describe('order service', () => {
  it('persists one receipt for concurrent retries', async () => {
    const repo = repository();
    const receipts = await Promise.all([
      placeOrder(validCheckout, 'same', repo),
      placeOrder(validCheckout, 'same', repo),
    ]);
    expect(receipts[0].id).toBe(receipts[1].id);
    expect(repo.data.size).toBe(1);
  });
  it('rejects reusing a checkout key for a changed cart', async () => {
    const repo = repository();
    await placeOrder(validCheckout, 'same', repo);
    await expect(
      placeOrder({ ...validCheckout, items: [{ productId: 1, quantity: 2 }] }, 'same', repo),
    ).rejects.toBeInstanceOf(IdempotencyConflict);
  });
  it('does not store payment credentials', async () => {
    const repo = repository();
    await placeOrder(
      { ...validCheckout, payment: { method: 'e-money', number: '987654321', pin: '8765' } },
      'new',
      repo,
    );
    expect(JSON.stringify(repo.insertIfAbsent.mock.calls)).not.toContain('987654321');
    expect(JSON.stringify(repo.insertIfAbsent.mock.calls)).not.toContain('8765');
  });
  it('propagates database failures instead of confirming an unsaved order', async () => {
    const repo = repository();
    repo.insertIfAbsent.mockRejectedValueOnce(new Error('unavailable'));
    await expect(placeOrder(validCheckout, 'new', repo)).rejects.toThrow('unavailable');
  });
});
