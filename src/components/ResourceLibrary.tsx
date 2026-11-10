'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, ClockIcon, HeartHandshakeIcon, SearchIcon, XIcon } from 'lucide-react';
import { cn } from '../utils/cn';
import {
  getPublicResourcePath,
  getPublicResourceTopic,
  type PublicResource,
} from '../types/resource';

export function ResourceLibrary({ resources }: { resources: PublicResource[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Topics');

  const categories = useMemo(
    () => ['All Topics', ...new Set(resources.map((resource) => getPublicResourceTopic(resource)?.name).filter((name): name is string => Boolean(name)))],
    [resources],
  );
  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return resources.filter((resource) => {
      const topicName = getPublicResourceTopic(resource)?.name || 'General';
      const matchesCategory = category === 'All Topics' || topicName === category;
      const matchesSearch =
        !term ||
        [resource.title, resource.shortDescription, topicName]
          .join(' ')
          .toLocaleLowerCase()
          .includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [resources, query, category]);

  return (
    <>
      <section className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand">
            <HeartHandshakeIcon className="h-3.5 w-3.5" />
            <span>Mental Health Library</span>
          </div>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
            Clinically reviewed resources written in plain language.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-body">
            Simple, text-based educational guides designed to be calm, grounded, and free of
            clinical jargon. Search by title or description, or filter by topic below.
          </p>

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
                placeholder="Search resources by title, topic, or keyword…"
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
                    : 'border-line bg-canvas text-body hover:border-brand hover:text-ink',
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-center justify-between gap-4">
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
              className="shrink-0 text-xs font-medium text-brand hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((resource) => {
              const topicName = getPublicResourceTopic(resource)?.name || 'General';
              return (
                <article
                  key={resource._id}
                  className="group flex flex-col justify-between rounded-3xl border border-line bg-surface p-6 transition-all duration-200 hover:border-brand/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-tint px-3 py-1 text-xs font-medium text-brand">
                        {topicName}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs text-body">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {resource.readingTime || 5} min read
                      </span>
                    </div>
                    <h2 className="mt-4 font-serif text-xl font-bold leading-snug text-ink transition-colors group-hover:text-brand">
                      <Link href={getPublicResourcePath(resource)}>{resource.title}</Link>
                    </h2>
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-body">
                      {resource.shortDescription}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-line pt-4">
                    <div className="flex items-center justify-end">
                      <Link
                        href={getPublicResourcePath(resource)}
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
            <h2 className="font-serif text-2xl text-ink">No resources found.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-body">
              Try a different search term or topic filter.
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
