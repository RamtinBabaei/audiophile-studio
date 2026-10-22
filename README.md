# Audiophile Studio

**Live demo:** [Open Audiophile Studio](https://audiophile-studio.ramtinbabaei-portfolio.workers.dev/)

A complete implementation of the [Frontend Mentor Audiophile challenge](https://www.frontendmentor.io/challenges/audiophile-ecommerce-website-C8cuSd_wx), built with React, TypeScript, Tailwind CSS, server-rendered routes, and a durable checkout API.

This integrated source package includes the complete application and the GitHub Actions deployment workflow. Persian first-run instructions are in [START_HERE_FA.md](START_HERE_FA.md); publication instructions are in [docs/GITHUB_ACTIONS_FA.md](docs/GITHUB_ACTIONS_FA.md).

**Portfolio demonstration:** orders are actually validated and persisted, but payments, deliveries, and email notifications are not performed. Use fictional customer information. This is not a live retail business.

## Run in VS Code

Prerequisites: Node.js **22.13 or newer**, Git, and pnpm **11.25.0**. No MongoDB binary, Docker container, cloud account, or API key is needed locally.

1. Extract `Audiophile_Studio_Complete.zip`.
2. Open the `audiophile-studio` folder in VS Code (the folder containing `package.json`).
3. Select **Terminal → New Terminal** and run:

```sh
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm db:migrate:local
pnpm dev
```

4. Open **http://localhost:5173**. If that port is occupied, use the exact URL printed in the terminal.
5. Visit **http://localhost:5173/api/health**. It should return `{"status":"ok","database":"connected","mode":"demo"}`.
6. Open a product, add it to the cart, reload, and confirm the cart is still there. Checkout using fictional contact details and e-Money number `123456789`, PIN `1234`, or select cash on delivery. The confirmation proves that a database write succeeded.

The database lives in `.wrangler/state/`; restarting the app preserves orders. Do not commit that directory. `pnpm db:migrate:local` is safe to repeat; Wrangler tracks applied migrations.

Persian walkthrough: [docs/LOCAL_SETUP_FA.md](docs/LOCAL_SETUP_FA.md).

## What works

- Homepage, headphones/speakers/earphones categories, all six product pages, galleries, box contents, related products, and 404/error states.
- Persistent device-local cart, cross-tab synchronization, quantity controls, individual removal, remove-all, empty state, and reload recovery.
- Accessible dialog-based cart/navigation/confirmation, keyboard focus restoration, labeled fields, validation messages, focus on first invalid field, and reduced-motion support.
- Both checkout payment-method flows, client and server Zod validation, authoritative integer-cent totals, fixed $50 shipping, and the challenge's 20% included-VAT display.
- Real D1 order persistence, idempotent submission, timeout/retry handling, and user-visible failures without discarding the cart.
- Art-directed WebP images, local subsetted Manrope font, eager hero loading, lazy secondary imagery, and route-based code splitting.

## Architecture

| Layer                 | Choice                                             | Reason                                                                      |
| --------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| UI                    | React 19 + TypeScript + Tailwind CSS 4             | Typed reusable components and reference-specific responsive styles          |
| Routing and rendering | Next.js App Router conventions through Vinext/Vite | Server-rendered content and separately loaded interactive checkout/cart     |
| API                   | TypeScript Web Request/Response handlers           | Same-origin API without an unnecessary separate Express process             |
| Validation            | Zod                                                | Shared structural rules; server always validates independently              |
| Cart                  | `useSyncExternalStore` + versioned localStorage    | Small state surface; no global-state dependency required                    |
| Persistence           | Cloudflare D1 (SQLite) + Drizzle                   | Durable hosted orders and identical local database emulation                |
| Tests                 | Vitest + Testing Library + Playwright specs        | Business logic, components, API boundaries, and repeatable browser journeys |
| Hosting               | Cloudflare Worker via Sites                        | The UI, API, and database run together                                      |

Vinext is a beta compatibility layer, not `next build`. The supported target for this package is Cloudflare Workers. Do not deploy it to Vercel or GitHub Pages without a deliberate runtime/database migration. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for tradeoffs.

```text
app/                 Server pages, route-level loading/errors, API handlers
components/store/    Shared storefront, cart, product and checkout components
lib/shop/            Catalog, pricing, validation, storage and order service
worker/              Worker entrypoint
db/                  Drizzle schema and D1 adapter
drizzle/             Generated SQL migrations and snapshots
 tests/               Unit, component, HTTP/service and browser tests
 scripts/             Portable build/dev/database helpers
 docs/                Setup, deployment, testing and architecture notes
 public/              Self-hosted images, font and icons
```

## Commands

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm format:check
pnpm build
pnpm start
```

`pnpm start` serves the production Worker locally, normally at **http://127.0.0.1:8787**; use the printed URL. It does not deploy. Build before starting it. Local dev and the built Worker share database state.

Browser specs can be run in a separate terminal while `pnpm dev` runs:

```sh
pnpm exec playwright install chromium webkit
pnpm test:e2e
```

`PLAYWRIGHT_BASE_URL` can target another local port. The mobile project uses an iPhone viewport/WebKit preset. Browser packages are only needed for this optional suite, not to run the store. The precise executed checks and verification limits are recorded in [docs/TESTING_REPORT.md](docs/TESTING_REPORT.md).

## API

| Endpoint            | Behavior                                                       |
| ------------------- | -------------------------------------------------------------- |
| `GET /api/products` | All six public catalog products, cached for five minutes       |
| `POST /api/quote`   | Validated cart array → authoritative quote in cents            |
| `POST /api/orders`  | Checkout payload + UUID `Idempotency-Key` → saved demo receipt |
| `GET /api/health`   | Runs a database query and reports service availability         |

No public endpoint lists customer details or retrieves orders. e-Money number/PIN are validated and discarded. They never appear in the database or the returned receipt. See [docs/API.md](docs/API.md).

## Deployment and GitHub

Follow [docs/GITHUB_ACTIONS_FA.md](docs/GITHUB_ACTIONS_FA.md) to publish from your personal GitHub account through GitHub Actions to your own Cloudflare Workers account. `.github/workflows/ci.yml` checks types, lint, formatting, unit tests, deployment configuration, the production build, and browser journeys before publishing. Set the documented repository secrets and variables to enable deployment; pull requests run checks only. [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) retains the manual deployment and operations reference.

Before a real commercial launch, connect a payment provider through verified webhooks, add fulfillment/inventory, deploy abuse controls, establish privacy/retention policies, verify tax rules for your jurisdiction, and complete independent security and accessibility reviews. The challenge's VAT presentation is a design requirement, not a tax engine.

## Attribution and licensing

Original application code is MIT licensed. The Audiophile name, design, product copy, and challenge images are credited to Frontend Mentor and retain their original terms; the MIT license does not grant rights to those assets. Public challenge assets/product content were sourced from the public `ronnieima/audiophile-ecommerce` repository; no Figma/Sketch files are included. Obtain your own Frontend Mentor entitlement before redistributing restricted challenge assets. Manrope is under the SIL Open Font License in `public/fonts/OFL.txt`; icons use Lucide's ISC license. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
