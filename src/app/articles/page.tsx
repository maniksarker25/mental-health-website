'use client';

import React, { useMemo, useState } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { TopicCard } from '../../components/TopicCard';
import { categories, topics } from '../../data/topics';
import { searchTopics } from '../../utils/article';
import { cn } from '../../utils/cn';

export default function ArticlesPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Topics');

  const results = useMemo(() => searchTopics(topics, query, category), [query, category]);

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-sm font-medium text-brand">Articles & topics</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
            Nine guides, written to be read on the worst day of someone’s week.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-body">
            Every guide is plain-language, ad-free, print-friendly, and reviewed by a licensed clinician. Search by
            symptom or filter by category, then dispatch the one that fits.
          </p>

          <div className="mt-9 max-w-xl">
            <label htmlFor="topic-search" className="sr-only">
              Search topics
            </label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-body" />
              <input
                id="topic-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “panic attack”, “can’t sleep”, “intrusive thoughts”…"
                className="w-full rounded-full border border-line bg-canvas py-3 pl-11 pr-11 text-sm text-ink placeholder:text-body transition-colors duration-150 ease-gentle focus:border-brand focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-body transition-colors duration-150 ease-gentle hover:text-ink"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-150 ease-gentle',
                  category === item
                    ? 'border-brand bg-brand text-white'
                    : 'border-line bg-canvas text-body hover:border-brand hover:text-ink'
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p aria-live="polite" className="text-sm text-body">
          {results.length} {results.length === 1 ? 'guide' : 'guides'}
          {category !== 'All Topics' && ` in ${category}`}
          {query && ` matching “${query}”`}
        </p>

        {results.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-line bg-surface p-10 text-center">
            <h2 className="font-serif text-2xl text-ink">No guide matches that yet.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-body">
              Our library is deliberately small so every guide stays current. Clear the filters to see everything, or
              request a topic and it enters the clinical review queue.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('All Topics');
              }}
              className="mt-6 inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-transform duration-150 ease-gentle hover:scale-[1.02]"
            >
              Show all guides
            </button>
          </div>
        )}
      </section>
    </>
  );
}
