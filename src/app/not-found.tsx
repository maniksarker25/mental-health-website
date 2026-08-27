import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-medium text-brand">404 — Page not found</p>
      <h1 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">We could not find that page or guide.</h1>
      <p className="mt-4 text-sm leading-relaxed text-body">
        The link may have moved or is out of date. Every clinical guide is listed in our catalogue, and none of them
        require an account or sign-up.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/articles"
          className="inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-transform duration-150 ease-gentle hover:scale-[1.02]"
        >
          Browse all guides
        </Link>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-150 ease-gentle hover:bg-canvas"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
