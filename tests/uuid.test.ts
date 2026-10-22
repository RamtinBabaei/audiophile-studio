import { describe, it, expect, vi } from 'vitest';
import { createUuid } from '@/lib/shop/uuid';
describe('checkout request UUID', () => {
  it('creates a v4 UUID in HTTP previews without randomUUID', () => {
    vi.spyOn(crypto, 'randomUUID').mockImplementation(
      undefined as unknown as typeof crypto.randomUUID,
    );
    Object.defineProperty(crypto, 'randomUUID', { configurable: true, value: undefined });
    expect(createUuid()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });
});
