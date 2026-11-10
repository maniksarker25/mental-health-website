import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeftIcon, ClockIcon, ShieldCheckIcon } from 'lucide-react';
import { BreathingPacer } from '../../../components/BreathingPacer';
import {
  getPublicResourcePath,
  getPublicResourceTopic,
  type PublicResource,
} from '../../../types/resource';
import { fetchPublishedResource, fetchPublishedResources } from '../../../lib/server/resources';

export const dynamic = 'force-dynamic';

interface ResourcePageProps {
  params: Promise<{ id: string }>;
}

function formatUpdatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `Updated ${new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(date)}`;
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const resource = await fetchPublishedResource(id);
    if (!resource) {
      return { title: 'Resource Not Found — Mental Health Anonymous' };
    }

    return {
      title: `${resource.title} — Mental Health Anonymous`,
      description: resource.shortDescription,
      openGraph: {
        title: resource.title,
        description: resource.shortDescription,
        ...(resource.featuredImage ? { images: [resource.featuredImage] } : {}),
      },
    };
  } catch (error) {
    console.error('Unable to load public resource metadata:', error);
    return { title: 'Mental Health Resources — Mental Health Anonymous' };
  }
}

export default async function ResourceDetailPage({ params }: ResourcePageProps) {
  const { id } = await params;
  let resource: PublicResource | null;
  try {
    resource = await fetchPublishedResource(id);
  } catch (error) {
    console.error('Unable to load public resource:', error);
    return (
      <article className="min-h-screen bg-canvas px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-surface p-8 text-center">
          <h1 className="font-serif text-3xl text-ink">Resource temporarily unavailable</h1>
          <p className="mt-3 text-sm leading-relaxed text-body">
            We could not load this resource right now. Please try again later.
          </p>
          <Link
            href="/resources"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to all resources
          </Link>
        </div>
      </article>
    );
  }

  if (!resource) notFound();

  let relatedResources: PublicResource[] = [];
  try {
    const related = await fetchPublishedResources({
      page: 1,
      limit: 4,
      ...(typeof resource.topic === 'object' && resource.topic
        ? { topic: resource.topic._id }
        : {}),
    });
    relatedResources = related.data.filter((item) => item._id !== resource._id).slice(0, 3);
  } catch (error) {
    console.error('Unable to load related public resources:', error);
  }

  const topic = getPublicResourceTopic(resource);
  const updatedAt = formatUpdatedAt(resource.updatedAt);

  return (
    <article className="min-h-screen bg-canvas pb-20">
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-xs font-medium text-body transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back to all resources
          </Link>
          <div className="flex items-center gap-2 text-xs font-medium text-brand">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            <span>Published Resource</span>
          </div>
        </div>
      </div>

      <header className="border-b border-line bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-body">
            <span className="rounded-full bg-brand-tint px-3 py-1 font-medium text-brand">
              {topic?.name || 'Mental Health'}
            </span>
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              {resource.readingTime || 5} min read
            </span>
            {updatedAt && (
              <>
                <span>·</span>
                <span>{updatedAt}</span>
              </>
            )}
          </div>

          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
            {resource.title}
          </h1>
          <p className="mt-4 font-serif text-lg leading-relaxed text-body sm:text-xl">
            {resource.shortDescription}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {resource.featuredImage && (
          <img
            src={resource.featuredImage}
            alt=""
            className="mb-10 max-h-[28rem] w-full rounded-3xl border border-line object-cover"
          />
        )}

        <div
          className="html-content"
          dangerouslySetInnerHTML={{ __html: resource.contentHtml }}
        />

        {relatedResources.length > 0 && (
          <div className="mt-14 border-t border-line pt-10">
            <h2 className="font-serif text-xl font-bold text-ink">Related Resources</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {relatedResources.map((related) => (
                <Link
                  key={related._id}
                  href={getPublicResourcePath(related)}
                  className="rounded-2xl border border-line bg-surface p-4 text-xs transition-colors hover:border-brand"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-brand">
                    {getPublicResourceTopic(related)?.name || 'Mental Health'}
                  </p>
                  <p className="mt-1 line-clamp-2 font-serif text-sm font-bold leading-snug text-ink">
                    {related.title}
                  </p>
                  <p className="mt-2 line-clamp-2 leading-relaxed text-body">
                    {related.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
