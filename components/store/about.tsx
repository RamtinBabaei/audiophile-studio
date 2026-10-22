import { ProductImage } from './ui';
export function About() {
  return (
    <section className="about wrap" aria-labelledby="about-title">
      <div className="about-copy">
        <p className="eyebrow copper">Made for the music</p>
        <h2 id="about-title">
          Bringing you the <em>best</em> audio gear
        </h2>
        <p>
          Located at the heart of New York City, Audiophile is the premier store for high end
          headphones, earphones, speakers, and audio accessories. We have a large showroom and
          luxury demonstration rooms available for you to browse and experience a wide range of our
          products. Stop by our store to meet some of the fantastic people who make Audiophile the
          best place to buy your portable audio equipment.
        </p>
      </div>
      <ProductImage
        image={{
          desktop: '/assets/shared/desktop/image-best-gear.webp',
          tablet: '/assets/shared/tablet/image-best-gear.webp',
          mobile: '/assets/shared/mobile/image-best-gear.webp',
        }}
        alt="A music lover enjoying a listening session with headphones"
      />
    </section>
  );
}
