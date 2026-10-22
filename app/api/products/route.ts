import { products } from '@/lib/shop/catalog';
export function GET() {
  return Response.json(products, {
    headers: { 'Cache-Control': 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' },
  });
}
