import { sql } from 'drizzle-orm';
import { getDb } from '@/db';
import { json } from '@/lib/shop/http';
export async function GET() {
  try {
    await getDb().get(sql`select 1`);
    return json({ status: 'ok', database: 'connected', mode: 'demo' });
  } catch {
    return json({ status: 'unavailable' }, 503);
  }
}
