import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { categories, products, type Category } from '@/lib/shop/catalog';
import { ProductImage, ProductLink } from '@/components/store/ui';
import { Categories } from '@/components/store/categories';
import { About } from '@/components/store/about';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return { title: category.charAt(0).toUpperCase() + category.slice(1) };
}
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!categories.includes(category as Category)) notFound();
  const collection = products
    .filter((p) => p.category === category)
    .sort((a, b) => Number(b.new) - Number(a.new) || b.price - a.price);
  return (
    <main id="main">
      <section className="category-heading">
        <p className="eyebrow">The collection</p>
        <h1>{category}</h1>
      </section>
      <div className="wrap">
        <div className="product-list">
          {collection.map((product, index) => (
            <article className={`product-row ${index % 2 ? 'reversed' : ''}`} key={product.id}>
              <ProductImage image={product.categoryImage} alt={product.name} eager={index === 0} />
              <div className="product-copy">
                {product.new && <p className="eyebrow copper">New product</p>}
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <ProductLink slug={product.slug} />
              </div>
            </article>
          ))}
        </div>
        <Categories />
      </div>
      <About />
    </main>
  );
}
