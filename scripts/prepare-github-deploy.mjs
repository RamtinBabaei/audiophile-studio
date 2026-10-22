import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));

export function prepareProductionConfig({ root = projectRoot, env = process.env } = {}) {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const databaseId = env.CLOUDFLARE_D1_DATABASE_ID?.trim();
  if (!/^[a-f0-9]{32}$/i.test(accountId ?? '')) {
    throw new Error(
      'Set the CLOUDFLARE_ACCOUNT_ID repository secret to your 32-character Cloudflare account ID.',
    );
  }
  if (!env.CLOUDFLARE_API_TOKEN?.trim()) {
    throw new Error('Set the CLOUDFLARE_API_TOKEN repository secret.');
  }
  if (
    !/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(databaseId ?? '') ||
    databaseId === '00000000-0000-4000-8000-000000000000' ||
    databaseId === '00000000-0000-0000-0000-000000000000'
  ) {
    throw new Error(
      'Set the CLOUDFLARE_D1_DATABASE_ID repository variable to the real audiophile-production database UUID.',
    );
  }

  const filename = path.join(root, 'dist/server/wrangler.json');
  const config = JSON.parse(readFileSync(filename, 'utf8'));
  const database = config.d1_databases?.find((binding) => binding.binding === 'DB');
  if (!database || !config.main || !config.assets?.directory) {
    throw new Error(
      'The build is missing its Worker entrypoint, assets, or DB binding. Run pnpm build first.',
    );
  }
  if (!existsSync(path.join(root, 'drizzle'))) {
    throw new Error('The drizzle migration directory is missing.');
  }

  config.name = 'audiophile-studio';
  config.topLevelName = config.name;
  config.account_id = accountId;
  config.workers_dev = true;
  config.preview_urls = false;
  database.database_name = 'audiophile-production';
  database.database_id = databaseId;
  database.migrations_dir = '../../drizzle';

  writeFileSync(filename, `${JSON.stringify(config, null, 2)}\n`);
  return filename;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    prepareProductionConfig();
    console.log('Prepared audiophile-studio with the independent production DB.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
