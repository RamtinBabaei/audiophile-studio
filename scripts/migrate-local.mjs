import { spawnSync } from 'node:child_process';
const result=spawnSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','migrations','apply','DB','--local','--config','wrangler.db.json','--persist-to','.wrangler/state'],{stdio:'inherit',env:{...process.env,CI:'true'}});
process.exit(result.status??1);
