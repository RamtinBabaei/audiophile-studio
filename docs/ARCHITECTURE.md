# Architecture decisions

## Scope

The reference is a frontend shopping challenge. A functional portfolio checkout requires no login or real payment integration. This implementation adds an actual backend and durable order records while explicitly labeling the monetary workflow as a demo. There are no mock success responses on database failure.

## Rendering and frontend

The catalog pages are Server Components. Only cart, navigation, quantity controls and checkout hydrate client behavior. Tailwind 4 is configured through PostCSS and used for layout utilities; authored CSS implements the detailed responsive art direction and shared design tokens. CSS transitions provide the required motion without an animation dependency. The framework splits routes and client references.

Catalog content is a small immutable typed module, shared with the public API and pricing service. A six-product editorial catalog does not require a CMS/database lookup on every visit. Orders, which must survive requests and sessions, use D1. Add a products table and inventory transactions if the commercial scope expands.

The cart contains only product IDs and quantities. Stored data is untrusted: unknown products, invalid quantities, duplicate entries and malformed JSON are sanitized. Storage failure preserves an in-memory cart; persistence is unavailable if the browser blocks localStorage. Cross-tab events synchronize device-local carts. Cart state is not synced across devices.

## Checkout and money

The client submits customer fields, cart IDs/quantities and the selected demo method. It cannot choose unit prices, shipping, VAT or grand total. The server validates strictly and re-resolves catalog prices. All calculations use integer cents.

The original design labels VAT as included and shows grand total = merchandise + $50 shipping. Accordingly VAT display = 20% of merchandise; it is not added again. This is the challenge convention, not the accounting formula for extracting 20% VAT from tax-inclusive real retail prices. A real tax engine would need different jurisdiction-aware rules.

## Orders and retries

A checkout attempt carries a UUID idempotency key. The database has a unique index on that key. An atomic insert-on-conflict followed by lookup returns the original receipt for retries. A SHA-256 fingerprint of the validated customer, sorted cart and payment method rejects a changed payload under the same key. Server tests cover concurrent requests at the service boundary; the SQL unique constraint provides the durable concurrency guarantee.

Payment number/PIN are excluded from fingerprint inputs, persisted customer data and receipt payloads. The server never logs bodies or PII. There is no customer-data retrieval API. Browser retry keys currently survive transient errors on the current page, not a complete browser close; the unique constraint protects requests that reuse a key.

## Storage and runtime

D1 is SQLite-compatible and supported directly by the hosting runtime. Drizzle provides typed access and generated migrations. PostgreSQL/Prisma would add an external service and connection adapter for this scope; Express would duplicate the existing API router. The repository interface isolates the order service from D1 for testing or migration.

Vinext beta implements Next.js-style APIs on Vite. It is required by the supported Sites full-stack deployment path; its beta status is a production-adoption tradeoff. Upgrading it requires rerunning browser and integration checks. Node scripts and Wrangler provide portable local development on Windows, macOS and Linux.

## Security boundary

JSON-only submissions, a streamed 16 KiB request-body cap, strict schemas, same-origin browser-write checks, prepared SQL and no-store order/health responses are implemented. Missing Origin is allowed for non-browser clients, so this is not an API authentication or abuse-prevention mechanism. Hosted preview access is private. Public commercial deployment needs platform rate limits/bot protection, monitoring, explicit data-retention policy and payment/fulfillment controls.
