import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { orders } from '@/db/schema';
import type { Receipt } from './checkout';
import type { OrderRepository } from './order-service';

export const orderRepository: OrderRepository = {
  async insertIfAbsent(key, fingerprint, customer, receipt) {
    await getDb()
      .insert(orders)
      .values({
        id: receipt.id,
        idempotencyKey: key,
        fingerprint,
        customer,
        receipt: JSON.stringify(receipt),
        createdAt: receipt.createdAt,
      })
      .onConflictDoNothing({ target: orders.idempotencyKey });
  },
  async findByKey(key) {
    const [row] = await getDb()
      .select({ fingerprint: orders.fingerprint, receipt: orders.receipt })
      .from(orders)
      .where(eq(orders.idempotencyKey, key))
      .limit(1);
    return row
      ? { fingerprint: row.fingerprint, receipt: JSON.parse(row.receipt) as Receipt }
      : undefined;
  },
};
