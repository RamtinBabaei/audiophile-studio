# Audiophile Studio

A modern audio storefront with server-rendered product pages, a persistent shopping cart, and database-backed checkout.

[![CI and deployment](https://github.com/RamtinBabaei/audiophile-studio/actions/workflows/ci.yml/badge.svg)](https://github.com/RamtinBabaei/audiophile-studio/actions/workflows/ci.yml)

[Live website](https://audiophile-studio.ramtinbabaei-portfolio.workers.dev/) · [Architecture](docs/ARCHITECTURE.md) · [API reference](docs/API.md)

Built with React, TypeScript, and Tailwind CSS. The storefront and API run together on Cloudflare Workers, with orders stored in Cloudflare D1 and deployments automated through GitHub Actions.

> **Demo checkout:** orders are validated and saved, but no payments are collected, products shipped, or emails sent. Use fictional customer details.

## Features

- **Product discovery:** dedicated headphone, speaker, and earphone collections, six product detail pages, image galleries, specifications, and related products.
- **Persistent cart:** quantity controls, individual removal, empty states, cross-tab synchronization, and recovery after page reloads.
- **Validated checkout:** shared client/server validation, two demo payment methods, and server-calculated totals using integer cents.
- **Durable orders:** D1 persistence, idempotent submissions, and retry handling that preserves the cart when a request fails.
- **Responsive experience:** layouts for mobile, tablet, and desktop, with transitions, hover feedback, and reduced-motion support.
- **Accessible interactions:** keyboard navigation, labeled inputs, focus management, and dialog-based cart and order confirmation.
- **Optimized assets:** responsive WebP imagery, a self-hosted Manrope font, lazy loading, and route-based code splitting.

## Technology

| Area       | Implementation                                         |
| ---------- | ------------------------------------------------------ |
| Interface  | React 19, TypeScript, Tailwind CSS 4                   |
| Rendering  | Next.js App Router conventions through Vinext and Vite |
| API        | TypeScript Web Request/Response handlers               |
| Validation | Zod                                                    |
| Cart state | `useSyncExternalStore` and versioned localStorage      |
| Database   | Cloudflare D1 with Drizzle ORM                         |
| Testing    | Vitest, Testing Library, Playwright                    |
| Hosting    | Cloudflare Workers                                     |
| Delivery   | GitHub Actions                                         |

Vinext is a beta compatibility layer. The build uses Vinext/Vite and targets Cloudflare Workers. See the [architecture notes](docs/ARCHITECTURE.md) for runtime choices and tradeoffs.

## Project structure

```text
app/                 Pages, layouts, loading states, and API routes
components/store/    Storefront, cart, and checkout components
lib/shop/            Catalog, pricing, validation, and order logic
db/                  Database schema and D1 adapter
drizzle/             SQL migrations
worker/              Cloudflare Worker entrypoint
public/              Images, fonts, and icons
tests/               Unit, component, service, and browser tests
scripts/             Development, build, migration, and deployment helpers
docs/                Setup, architecture, API, and testing documentation
.github/workflows/   Continuous integration and deployment
```

## Run locally

**Requirements:** Node.js 22.13 or newer and pnpm 11.25.0.

```sh
git clone https://github.com/RamtinBabaei/audiophile-studio.git
cd audiophile-studio
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm db:migrate:local
pnpm dev
```

Open the URL printed in the terminal, normally `http://localhost:5173`.

Local development uses an emulated D1 database and requires no cloud credentials. Database state persists in `.wrangler/state/`. Migrations can be run again safely.

For a checkout walkthrough, add a product to the cart and use fictional contact details. Choose cash on delivery, or use the demo e-Money number `123456789` and PIN `1234`.

Persian setup guides: [first run](START_HERE_FA.md) · [local troubleshooting](docs/LOCAL_SETUP_FA.md).

## Quality checks

| Command             | Purpose                            |
| ------------------- | ---------------------------------- |
| `pnpm typecheck`    | TypeScript validation              |
| `pnpm lint`         | ESLint checks                      |
| `pnpm format:check` | Formatting verification            |
| `pnpm test`         | Unit, component, and service tests |
| `pnpm build`        | Production Worker build            |
| `pnpm start`        | Serve the production build locally |
| `pnpm test:e2e`     | Playwright browser journeys        |

To run browser tests, start the app in one terminal, then run the following in another:

```sh
pnpm exec playwright install chromium webkit
pnpm test:e2e
```

Set `PLAYWRIGHT_BASE_URL` when using a different local address. Production preview requires `pnpm build` before `pnpm start`; it normally runs at `http://127.0.0.1:8787`.

Browser coverage includes product browsing, cart persistence, checkout validation, order confirmation, and responsive layouts. See the [testing report](docs/TESTING_REPORT.md) for verification details.

## API

| Endpoint            | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `GET /api/products` | Return the public product catalog           |
| `POST /api/quote`   | Validate cart items and calculate totals    |
| `POST /api/orders`  | Validate and persist a demo order           |
| `GET /api/health`   | Check application and database availability |

Order submissions use a UUID `Idempotency-Key` to prevent duplicate orders during retries. Pricing is calculated on the server. Demo e-Money credentials are validated and discarded; they are not stored in the database.

See the [API documentation](docs/API.md) for request and response formats.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow:

1. Install dependencies and check types, lint, and formatting.
2. Run unit tests and deployment configuration checks.
3. Build the production Worker and run browser journeys against it.
4. Apply production database migrations and deploy to Cloudflare.
5. Verify the live database connection and publish the website link in the workflow summary.

Pull requests run verification without deploying. Publishing requires the repository secrets and variables described in the [deployment guide](docs/GITHUB_ACTIONS_FA.md).

[View workflow runs](https://github.com/RamtinBabaei/audiophile-studio/actions/workflows/ci.yml) · [Deployment and operations](docs/DEPLOYMENT.md)

## License

Application code is available under the [MIT License](LICENSE). Third-party design, imagery, fonts, and icon credits are documented in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md); their original licenses and terms apply.

Maintained by [Ramtin Babaei](https://github.com/RamtinBabaei).
