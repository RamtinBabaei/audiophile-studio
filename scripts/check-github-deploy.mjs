import { appendFileSync, readFileSync } from 'node:fs';

const log = readFileSync('.sites-runtime/deploy.log', 'utf8');
const urls = [...log.matchAll(/https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev\b/gi)];
const origin = urls.at(-1)?.[0];
if (!origin) {
  throw new Error(
    'Wrangler did not print a workers.dev URL. Check the deployment log and enable the workers.dev subdomain in Cloudflare.',
  );
}

let healthy = false;
let detail = 'The live API did not become ready.';
for (let attempt = 0; attempt < 8; attempt++) {
  try {
    const response = await fetch(`${origin}/api/health`, { signal: AbortSignal.timeout(10_000) });
    const result = await response.json();
    if (response.ok && result.status === 'ok' && result.database === 'connected') {
      healthy = true;
      break;
    }
    detail = `Health check returned HTTP ${response.status}.`;
  } catch (error) {
    detail = error.message;
  }
  if (attempt < 7) await new Promise((resolve) => setTimeout(resolve, 5_000));
}

const summary = `## Audiophile deployment\n\n[Open the live website](${origin})\n\n[Check the database](${origin}/api/health)\n\nDatabase health: **${healthy ? 'connected' : 'failed'}**.\n\nAfter the first deployment, set the repository variable \`SITE_URL\` to \`${origin}\` and rerun the workflow to update social sharing metadata.\n`;
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
console.log(`Live website: ${origin}`);
if (!healthy)
  throw new Error(`Deployment completed, but its live database check failed: ${detail}`);
console.log('Live database health check passed.');
