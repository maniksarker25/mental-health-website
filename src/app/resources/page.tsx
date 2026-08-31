'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { SearchIcon, XIcon, BookOpenIcon, ClockIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { categories, topics } from '../../data/topics';
import { searchTopics } from '../../utils/article';
import { cn } from '../../utils/cn';
import { toneStyles, topicIcons } from '../../utils/tone';

export default function ResourcesPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Topics');

  const results = useMemo(() => searchTopics(topics, query, category), [query, category]);

  return (
    <>
      {/* Header & Filter Section */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand">
            <BookOpenIcon className="h-3.5 w-3.5" />
            <span>Mental Health Library</span>
          </div>

          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
            Clinically reviewed resources written in plain language.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-body">
            Simple, text-based educational guides designed to be calm, grounded, and free of clinical jargon.
            Search by title or symptom description, or filter by topic below.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-xl">
            <label htmlFor="resource-search" className="sr-only">
              Search resources by title and description
            </label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-body" />
              <input
                id="resource-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, symptom, or keyword (e.g. “panic attack”, “burnout”, “grief”)…"
                className="w-full rounded-full border border-line bg-canvas py-3.5 pl-11 pr-11 text-sm text-ink placeholder:text-body transition-colors duration-150 ease-gentle focus:border-brand focus:outline-none shadow-xs"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-body transition-colors duration-150 ease-gentle hover:text-ink"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Topic Filter Pills */}
          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-150 ease-gentle',
                  category === item
                    ? 'border-brand bg-brand text-white shadow-xs'
                    : 'border-line bg-canvas text-body hover:border-brand hover:text-ink'
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-center justify-between">
          <p aria-live="polite" className="text-sm font-medium text-body">
            Showing {results.length} {results.length === 1 ? 'resource' : 'resources'}
            {category !== 'All Topics' && ` in “${category}”`}
            {query && ` matching “${query}”`}
          </p>

          {(query || category !== 'All Topics') && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('All Topics');
              }}
              className="text-xs font-medium text-brand hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((topic) => {
              const tone = toneStyles[topic.tone];
              const Icon = topicIcons[topic.icon];

              return (
                <article
                  key={topic.id}
                  className="group flex flex-col justify-between rounded-3xl border border-line bg-surface p-6 transition-all duration-200 hover:border-brand/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
                          tone.pill
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {topic.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-body">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {topic.readingTime} min read
                      </span>
                    </div>

                    <h2 className="mt-4 font-serif text-xl font-bold leading-snug text-ink group-hover:text-brand transition-colors">
                      <Link href={`/resources/${topic.id}`}>
                        {topic.title}
                      </Link>
                    </h2>

                    <p className="mt-2.5 text-sm leading-relaxed text-body line-clamp-3">
                      {topic.excerpt}
                    </p>

                    {/* Key takeaway preview */}
                    <div className="mt-4 rounded-xl border border-line/70 bg-canvas/70 p-3 text-xs text-body">
                      <p className="font-semibold text-ink">Focus:</p>
                      <p className="mt-0.5 line-clamp-2 leading-relaxed">{topic.subtitle}</p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-line pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-body">{topic.updated}</span>
                      <Link
                        href={`/resources/${topic.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors hover:text-ink"
                      >
                        Read resource
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-line bg-surface p-12 text-center">
            <h2 className="font-serif text-2xl text-ink">No resource found matching your criteria.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-body">
              Try searching with a different term like “anxiety”, “sleep”, “low mood”, or reset the topic filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('All Topics');
              }}
              className="mt-6 inline-flex items-center rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition-transform duration-150 ease-gentle hover:scale-[1.02]"
            >
              Show all resources
            </button>
          </div>
        )}
      </section>
    </>
  );
}
