import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const orders = sqliteTable(
  'orders',
  {
    id: text('id').primaryKey(),
    idempotencyKey: text('idempotency_key').notNull(),
    fingerprint: text('fingerprint').notNull(),
    customer: text('customer_json').notNull(),
    receipt: text('receipt_json').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (table) => [uniqueIndex('orders_idempotency_key_idx').on(table.idempotencyKey)],
);
