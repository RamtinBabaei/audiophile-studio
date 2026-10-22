import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { prepareProductionConfig } from './prepare-github-deploy.mjs';

const credentials = {
  CLOUDFLARE_ACCOUNT_ID: 'a'.repeat(32),
  CLOUDFLARE_API_TOKEN: 'fixture-token-never-sent',
  CLOUDFLARE_D1_DATABASE_ID: '12345678-1234-4234-8234-123456789abc',
};

test('missing credentials fail before touching build files', () => {
  assert.throws(
    () => prepareProductionConfig({ root: '/missing', env: {} }),
    /CLOUDFLARE_ACCOUNT_ID/,
  );
  assert.throws(
    () =>
      prepareProductionConfig({
        root: '/missing',
        env: { ...credentials, CLOUDFLARE_API_TOKEN: '' },
      }),
    /CLOUDFLARE_API_TOKEN/,
  );
});

test('a local placeholder cannot be deployed as the production database', () => {
  assert.throws(
    () =>
      prepareProductionConfig({
        root: '/missing',
        env: {
          ...credentials,
          CLOUDFLARE_D1_DATABASE_ID: '00000000-0000-4000-8000-000000000000',
        },
      }),
    /real audiophile-production database UUID/,
  );
});

test('production config binds the real DB and preserves the built application and local configuration', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'audiophile-deploy-'));
  try {
    mkdirSync(path.join(root, 'dist/server'), { recursive: true });
    mkdirSync(path.join(root, 'drizzle'));
    const original = {
      name: 'local',
      main: 'index.js',
      assets: { directory: '../client' },
      d1_databases: [{ binding: 'DB', database_id: 'local-placeholder' }],
    };
    writeFileSync(path.join(root, 'dist/server/wrangler.json'), JSON.stringify(original));
    writeFileSync(path.join(root, 'wrangler.db.json'), '{"name":"local-only"}');
    const filename = prepareProductionConfig({ root, env: credentials });
    const config = JSON.parse(readFileSync(filename, 'utf8'));
    assert.equal(config.name, 'audiophile-studio');
    assert.equal(config.account_id, credentials.CLOUDFLARE_ACCOUNT_ID);
    assert.equal(config.workers_dev, true);
    assert.equal(config.d1_databases[0].database_id, credentials.CLOUDFLARE_D1_DATABASE_ID);
    assert.equal(
      path.resolve(path.dirname(filename), config.d1_databases[0].migrations_dir),
      path.join(root, 'drizzle'),
    );
    assert.equal(config.main, original.main);
    assert.deepEqual(config.assets, original.assets);
    assert.equal(
      readFileSync(path.join(root, 'wrangler.db.json'), 'utf8'),
      '{"name":"local-only"}',
    );
    assert.equal(readFileSync(filename, 'utf8').includes(credentials.CLOUDFLARE_API_TOKEN), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
