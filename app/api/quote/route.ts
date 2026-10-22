import { ZodError } from 'zod';
import { quoteCart } from '@/lib/shop/checkout';
import { HttpError, json, readJson } from '@/lib/shop/http';
export async function POST(request: Request) {
  try {
    return json(quoteCart(await readJson(request)));
  } catch (error) {
    if (error instanceof ZodError) return json({ error: 'Your cart contains invalid items.' }, 422);
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    return json({ error: 'Unable to calculate your order.' }, 500);
  }
}
