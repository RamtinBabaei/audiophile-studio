# Publishing and operations

The integrated package includes automated publication from the owner's personal GitHub repository to an independent Cloudflare account. Follow [GITHUB_ACTIONS_FA.md](GITHUB_ACTIONS_FA.md) for that path. The sections below document the original hosted preview and the alternative manual publishing procedure.

## Included hosted site

The project is configured for its owner-private Sites deployment. `.openai/hosting.json` records its Site identity and `DB` binding. The hosting workflow provisions D1, applies the generated `drizzle/` migrations, and publishes the Worker plus static assets.

The deployed link is suitable for reviewing this demo while signed in as the owner. A private link is not a public portfolio URL. Change access only when you intend to make the demo public. No payment provider is connected.

## Put the source on GitHub

Create a new empty GitHub repository. Open the extracted project folder in VS Code and run:

```sh
git init
git add .
git commit -m "Build Audiophile storefront and durable demo checkout"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/audiophile-studio.git
git push -u origin main
```

Replace the remote URL with your repository URL. `.env.example`, generated SQL, lockfile and configuration belong in source control. `.env*`, `.wrangler/`, `node_modules/`, build output, test traces and runtime state are ignored. Never commit secrets or customer data. The included CI runs automatically; its browser suite requires the GitHub runner to download browser binaries.

GitHub stores your source; **GitHub Pages cannot run this checkout API or database**. Use Workers hosting for the full application.

## Independent Cloudflare Workers deployment

The same application can be deployed outside Sites with your own Cloudflare account. The supplied Vite integration remains in place. This path requires account access and creates a new database; local order data is not uploaded.

1. Install dependencies and log in:

```sh
pnpm install --frozen-lockfile
pnpm exec wrangler login
pnpm exec wrangler d1 create audiophile-production
```

2. Copy `wrangler.db.json` to `wrangler.production.json` and replace the placeholder `database_id` with the ID printed by the create command. Set `database_name` to `audiophile-production`, preserve `binding: "DB"` and `migrations_dir: "drizzle"`.
3. Update **the production build configuration** in `vite.config.ts`: use that actual production database name/ID instead of the local placeholder values. Database IDs identify infrastructure; they are not API secrets. The developer-owned independent configuration should not be pushed back into an existing Sites-managed project.
4. Apply remote migrations, then build and deploy:

```sh
pnpm exec wrangler d1 migrations apply DB --remote --config wrangler.production.json
pnpm build
pnpm exec wrangler deploy --config dist/server/wrangler.json
```

5. Open the exact HTTPS URL returned by Wrangler. Check `/api/health`, then run the shopping journey with fictional data. Update `metadataBase` in `app/layout.tsx` to your deployed origin and rebuild/redeploy. Configure a custom domain in Cloudflare if desired.

The migration command must use the real production database ID. Do not run it with the local placeholder. Verify the built `dist/server/wrangler.json` has the real ID before deployment. Production data and the local database are separate.

## Production build preview

```sh
pnpm db:migrate:local
pnpm build
pnpm start
```

Open the printed loopback URL, typically `http://127.0.0.1:8787`. `pnpm start` is local emulation and does not publish.

## Operational limits

- This is a portfolio store, not a payment/fulfillment service.
- The D1 order table stores fictional customer/shipping details for demo verification; payment number/PIN are discarded. Before collecting real PII, establish a retention/deletion policy and access controls.
- Orders have no public read/list API. Customer accounts, stock control, email delivery and an admin dashboard are outside the challenge scope.
- Add platform rate limits and monitoring before opening a commercial checkout.
- The framework is Vinext beta. Validate upgrades and runtime compatibility in staging.
- The dependency report records a remaining unpatched development-tooling advisory. Do not claim the complete dependency tree is vulnerability-free.
- CI is included as source and has not been run on your GitHub account as part of this delivery.
