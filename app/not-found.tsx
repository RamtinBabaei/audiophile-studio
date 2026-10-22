import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="status-page wrap">
      <p className="eyebrow copper">404 · Out of range</p>
      <h1>
        Let’s get you back
        <br />
        to good sound.
      </h1>
      <p>We couldn’t find that page. The collection is right here.</p>
      <Link href="/" className="button button-primary">
        Back to home
      </Link>
    </main>
  );
}
