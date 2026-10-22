/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ArrowDown, Headphones, ShieldCheck, Truck } from 'lucide-react';
import { Categories } from '@/components/store/categories';
import { About } from '@/components/store/about';
import { ProductImage, ProductLink } from '@/components/store/ui';
export default function Home() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <picture className="hero-image">
          <source media="(min-width:1024px)" srcSet="/assets/home/desktop/image-hero.webp" />
          <source media="(min-width:640px)" srcSet="/assets/home/tablet/image-header.webp" />
          <img
            src="/assets/home/mobile/image-header.webp"
            alt="XX99 Mark II headphones in a dramatic studio light"
            width={1440}
            height={729}
            fetchPriority="high"
          />
        </picture>
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">New product</p>
            <h1 id="hero-title">
              XX99 Mark II
              <br />
              Headphones
            </h1>
            <p className="hero-description">
              Experience natural, lifelike audio and exceptional build quality made for the
              passionate music enthusiast.
            </p>
            <ProductLink slug="xx99-mark-two-headphones" />
          </div>
          <a className="hero-scroll" href="#collection">
            <span>Discover the collection</span>
            <ArrowDown size={15} />
          </a>
          <span className="hero-edition">
            01 / 06 <span>THE SIGNATURE COLLECTION</span>
          </span>
        </div>
      </section>
      <div className="wrap">
        <div className="service-strip">
          <span>
            <Headphones size={17} /> Expertly curated sound
          </span>
          <span>
            <Truck size={18} /> Carefully delivered
          </span>
          <span>
            <ShieldCheck size={17} /> Built to be listened to
          </span>
        </div>
        <section id="collection" className="collection">
          <div className="section-intro">
            <p className="eyebrow copper">Find your frequency</p>
            <span>A better way to listen.</span>
          </div>
          <Categories />
        </section>
        <section className="home-features" aria-label="Featured audio products">
          <article className="zx9-feature">
            <div className="speaker-rings" aria-hidden="true" />
            <img
              src="/assets/home/desktop/image-speaker-zx9.png"
              alt="ZX9 speaker"
              width={410}
              height={493}
              loading="lazy"
            />
            <div>
              <p className="eyebrow">Sound without limits</p>
              <h2>
                ZX9
                <br />
                Speaker
              </h2>
              <p>
                Upgrade to premium speakers that are phenomenally built to deliver truly remarkable
                sound.
              </p>
              <ProductLink slug="zx9-speaker" variant="dark" />
            </div>
          </article>
          <article className="zx7-feature">
            <ProductImage
              image={{
                desktop: '/assets/home/desktop/image-speaker-zx7.webp',
                tablet: '/assets/home/tablet/image-speaker-zx7.webp',
                mobile: '/assets/home/mobile/image-speaker-zx7.webp',
              }}
              alt="ZX7 speaker in a minimalist living space"
            />
            <div>
              <p className="eyebrow">Room-filling clarity</p>
              <h2>ZX7 Speaker</h2>
              <ProductLink slug="zx7-speaker" variant="outline" />
            </div>
          </article>
          <article className="yx1-feature">
            <ProductImage
              image={{
                desktop: '/assets/home/desktop/image-earphones-yx1.webp',
                tablet: '/assets/home/tablet/image-earphones-yx1.webp',
                mobile: '/assets/home/mobile/image-earphones-yx1.webp',
              }}
              alt="YX1 earphones in their charging case"
            />
            <div>
              <p className="eyebrow copper">Small form. Big feeling.</p>
              <h2>YX1 Earphones</h2>
              <ProductLink slug="yx1-earphones" variant="outline" />
            </div>
          </article>
        </section>
      </div>
      <About />
      <section className="closing-band">
        <div className="wrap">
          <p>
            Your music.
            <br />
            <span>As it was meant to be.</span>
          </p>
          <Link href="/headphones" className="button button-outline">
            Find your sound
          </Link>
        </div>
      </section>
    </main>
  );
}
