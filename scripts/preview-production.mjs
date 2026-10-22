import { spawn } from 'node:child_process';
const args = process.argv.slice(2);
const value = (name, fallback) => {
  const index = args.indexOf(name);
  return index < 0 ? fallback : args[index + 1];
};
const child = spawn(
  process.execPath,
  [
    '--import',
    './scripts/sites-env.mjs',
    './node_modules/wrangler/bin/wrangler.js',
    'dev',
    '--config',
    'dist/server/wrangler.json',
    '--local',
    '--persist-to',
    '.wrangler/state',
    '--ip',
    value('--host', '127.0.0.1'),
    '--port',
    value('--port', '4173'),
    '--inspector-port',
    '0',
  ],
  { stdio: 'inherit', env: process.env },
);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code) => process.exit(code ?? 1));
