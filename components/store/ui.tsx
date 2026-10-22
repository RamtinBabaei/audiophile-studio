import Link from 'next/link';
import type { ResponsiveImage } from '@/lib/shop/catalog';

export function ProductImage({
  image,
  alt,
  className = '',
  eager = false,
}: {
  image: ResponsiveImage;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <picture className={className}>
      <source media="(min-width: 1024px)" srcSet={image.desktop} />
      <source media="(min-width: 640px)" srcSet={image.tablet} />
      <img
        src={image.mobile}
        alt={alt}
        width={540}
        height={560}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  );
}
export function ProductLink({
  slug,
  variant = 'primary',
  children = 'See product',
}: {
  slug: string;
  variant?: 'primary' | 'outline' | 'dark';
  children?: React.ReactNode;
}) {
  return (
    <Link className={`button button-${variant}`} href={`/product/${slug}`}>
      {children}
    </Link>
  );
}
export function Arrow() {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden="true">
      <path d="m2 1 5 5-5 5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
