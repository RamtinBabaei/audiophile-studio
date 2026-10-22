import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProduct, money } from '@/lib/shop/catalog';
import { ProductImage, ProductLink } from '@/components/store/ui';
import { AddToCart } from '@/components/store/add-to-cart';
import { Categories } from '@/components/store/categories';
import { About } from '@/components/store/about';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product?.name ?? 'Product not found', description: product?.description };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return (
    <main id="main">
      <div className="wrap product-detail">
        <Link className="back-link" href={`/${product.category}`}>
          ← Back to {product.category}
        </Link>
        <section className="product-row">
          <ProductImage image={product.image} alt={product.name} eager />
          <div className="product-copy">
            {product.new && <p className="eyebrow copper">New product</p>}
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <strong className="product-price">{money(product.price * 100)}</strong>
            <AddToCart slug={slug} name={product.name} />
            <span className="product-assurance">Designed for a lifetime of listening.</span>
          </div>
        </section>
        <div className="product-information">
          <section>
            <h2>Features</h2>
            {product.features.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
          <section className="in-the-box">
            <h2>In the box</h2>
            <ul>
              {product.includes.map((item) => (
                <li key={item.item}>
                  <span>{item.quantity}x</span>
                  {item.item}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <section className="gallery" aria-label={`${product.name} gallery`}>
          {Object.entries(product.gallery).map(([key, image], i) => (
            <ProductImage
              key={key}
              image={image}
              alt={`${product.name} — ${['listening experience', 'design details', 'studio view'][i]}`}
            />
          ))}
        </section>
        <section className="related">
          <p className="eyebrow copper">Keep exploring</p>
          <h2>You may also like</h2>
          <div>
            {product.others.map((other) => (
              <article key={other.slug}>
                <ProductImage image={other.image} alt={other.name} />
                <h3>{other.name}</h3>
                <ProductLink slug={other.slug} />
              </article>
            ))}
          </div>
        </section>
        <Categories />
      </div>
      <About />
    </main>
  );
}
