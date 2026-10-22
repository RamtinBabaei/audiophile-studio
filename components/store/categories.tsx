/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { categories } from '@/lib/shop/catalog';
import { Arrow } from './ui';
export function Categories({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Shop by category" className={`category-grid ${compact ? 'compact' : ''}`}>
      {categories.map((category) => (
        <Link
          href={`/${category}`}
          className="category-tile group"
          key={category}
          onClick={onNavigate}
        >
          <img
            src={`/assets/shared/desktop/image-category-thumbnail-${category}.png`}
            alt=""
            width={220}
            height={200}
            loading="lazy"
          />
          <h2>{category}</h2>
          <span>
            Shop <Arrow />
          </span>
        </Link>
      ))}
    </nav>
  );
}
