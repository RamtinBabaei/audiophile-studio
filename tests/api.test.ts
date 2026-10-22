import { beforeEach, describe, it, expect, vi } from 'vitest';
import { validCheckout } from './fixtures';
import type { Receipt } from '@/lib/shop/checkout';
const fake = vi.hoisted(() => ({
  data: new Map<string, { fingerprint: string; receipt: Receipt }>(),
  unavailable: false,
}));
vi.mock('@/lib/shop/order-repository', () => ({
  orderRepository: {
    async insertIfAbsent(key: string, fingerprint: string, _customer: string, receipt: Receipt) {
      if (fake.unavailable) throw new Error('DB offline');
      if (!fake.data.has(key)) fake.data.set(key, { fingerprint, receipt });
    },
    async findByKey(key: string) {
      return fake.data.get(key);
    },
  },
}));
import { POST } from '@/app/api/orders/route';
const key = '7ded188e-199a-43ed-a9ed-5854fe514647';
function request(body: unknown = validCheckout, headers: Record<string, string> = {}) {
  return new Request('https://shop.example/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key, ...headers },
    body: JSON.stringify(body),
  });
}
beforeEach(() => {
  fake.data.clear();
  fake.unavailable = false;
});
describe('orders route', () => {
  it('creates a receipt without exposing customer information', async () => {
    const response = await POST(request());
    expect(response.status).toBe(201);
    const text = await response.text();
    expect(text).toContain('"mode":"demo"');
    expect(text).not.toContain('alex@example.com');
    expect(response.headers.get('cache-control')).toBe('no-store');
  });
  it('returns the original receipt on an HTTP retry', async () => {
    const a = await (await POST(request())).json();
    const b = await (await POST(request())).json();
    expect(a).toEqual(b);
    expect(fake.data.size).toBe(1);
  });
  it('returns 409 for changed payload under the same key', async () => {
    await POST(request());
    expect(
      (await POST(request({ ...validCheckout, items: [{ productId: 1, quantity: 1 }] }))).status,
    ).toBe(409);
  });
  it('returns 422 for an invalid key', async () => {
    expect((await POST(request(validCheckout, { 'Idempotency-Key': 'bad' }))).status).toBe(422);
  });
  it('returns 422 for client-supplied prices', async () => {
    expect(
      (
        await POST(
          request({ ...validCheckout, items: [{ productId: 1, quantity: 1, unitPrice: 1 }] }),
        )
      ).status,
    ).toBe(422);
  });
  it('returns 403 for a hostile browser origin', async () => {
    expect(
      (await POST(request(validCheckout, { Origin: 'https://attacker.example' }))).status,
    ).toBe(403);
  });
  it('returns a safe 503 on persistence failure', async () => {
    fake.unavailable = true;
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('DB offline');
    expect(fake.data.size).toBe(0);
  });
});
