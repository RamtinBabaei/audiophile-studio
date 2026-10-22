import { z, ZodError } from 'zod';
import { orderRepository } from '@/lib/shop/order-repository';
import { IdempotencyConflict, placeOrder } from '@/lib/shop/order-service';
import { HttpError, json, readJson } from '@/lib/shop/http';

export async function POST(request: Request) {
  try {
    const payload = await readJson(request);
    const key = z.string().uuid().parse(request.headers.get('idempotency-key'));
    return json(await placeOrder(payload, key, orderRepository), 201);
  } catch (error) {
    if (error instanceof ZodError)
      return json({ error: 'Please check the checkout details.', issues: error.flatten() }, 422);
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    if (error instanceof IdempotencyConflict) return json({ error: error.message }, 409);
    return json(
      { error: 'We could not save your order. Your cart is safe. Please try again.' },
      503,
    );
  }
}
