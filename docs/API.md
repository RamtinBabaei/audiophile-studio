# API contract

All monetary values in API responses are integer USD cents. UI formatting happens at the edge of the view. Orders/health/quotes use `Cache-Control: no-store`.

## Quote

`POST /api/quote`, `Content-Type: application/json`

```json
[{ "productId": 4, "quantity": 1 }]
```

Returns `items` (name, slug, unitPrice, lineTotal, quantity), `subtotal`, `shipping`, `vat`, and `grandTotal`. The six catalog IDs are available from `GET /api/products`.

## Create demo order

`POST /api/orders` requires a UUID `Idempotency-Key` header and `application/json`:

```json
{
  "customer": {
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "phone": "+1 202 555 0146",
    "address": "1137 Williams Avenue",
    "zip": "10001",
    "city": "New York",
    "country": "United States"
  },
  "items": [{ "productId": 4, "quantity": 1 }],
  "payment": { "method": "cash" }
}
```

Alternatively use `{"method":"e-money","number":"123456789","pin":"1234"}`. These are demo-only fields. Credentials are immediately discarded after validation.

Success: **201**, a receipt containing quote values, UUID `id`, ISO `createdAt`, `paymentMethod` and `mode:"demo"`. Repeating the exact valid request with the same key returns the original receipt, also 201. Reusing a key for different customer/cart/method data returns 409.

| Status | Meaning                                               |
| ------ | ----------------------------------------------------- |
| 400    | Malformed or missing JSON                             |
| 403    | Browser Origin does not match the request origin      |
| 409    | Idempotency key already used for a different checkout |
| 413    | Body exceeds 16 KiB                                   |
| 415    | Content type is not JSON                              |
| 422    | Invalid fields, cart or idempotency key               |
| 503    | Order storage unavailable; no success is shown        |

Each cart has 1–6 distinct products and quantities 1–99. Unknown product IDs, extra price fields and duplicate line items are rejected. Empty carts do not incur shipping because they cannot be quoted or checked out.

There is intentionally no order/customer list or retrieval endpoint. Service availability is exposed through `GET /api/health` and returns 503 on database failure.
