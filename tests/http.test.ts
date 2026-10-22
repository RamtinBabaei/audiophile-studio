import { describe, it, expect } from 'vitest';
import { readJson } from '@/lib/shop/http';
const request = (body: string, headers: Record<string, string> = {}) =>
  new Request('https://shop.example/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body,
  });
describe('HTTP request boundary', () => {
  it('parses same-origin JSON', async () => {
    expect(await readJson(request('{"items":[]}', { origin: 'https://shop.example' }))).toEqual({
      items: [],
    });
  });
  it('rejects cross-origin submissions', async () => {
    await expect(
      readJson(request('{}', { origin: 'https://attacker.example' })),
    ).rejects.toMatchObject({ status: 403 });
  });
  it('rejects unsupported content types', async () => {
    await expect(readJson(request('{}', { 'content-type': 'text/plain' }))).rejects.toMatchObject({
      status: 415,
    });
  });
  it('rejects malformed JSON', async () => {
    await expect(readJson(request('{broken'))).rejects.toMatchObject({ status: 400 });
  });
  it('rejects excessive request bodies', async () => {
    await expect(
      readJson(request(JSON.stringify({ data: 'x'.repeat(17000) }))),
    ).rejects.toMatchObject({ status: 413 });
  });
});
