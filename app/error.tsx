'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="status-page wrap">
      <h1>A brief interruption.</h1>
      <p>Something went wrong loading this page. Please try again.</p>
      <button className="button button-primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
