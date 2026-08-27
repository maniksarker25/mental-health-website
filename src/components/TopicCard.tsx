import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon, ClockIcon, LayersIcon } from 'lucide-react';
import type { Topic } from '../types/topic';
import { toneStyles, topicIcons } from '../utils/tone';
import { countSections } from '../utils/article';
import { cn } from '../utils/cn';

interface TopicCardProps {
  topic: Topic;
  featured?: boolean;
}

export function TopicCard({ topic, featured = false }: TopicCardProps) {
  const tone = toneStyles[topic.tone];
  const Icon = topicIcons[topic.icon];

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface',
        'transition-shadow duration-200 ease-gentle hover:shadow-[0_18px_40px_-28px_rgba(24,35,31,0.45)]'
      )}
    >
      <div className={cn('relative overflow-hidden', featured ? 'aspect-[16/9]' : 'aspect-[3/2]')}>
        <img
          src={topic.featuredImage}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-gentle group-hover:scale-[1.03]"
        />
        <span
          className={cn(
            'absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
            tone.pill
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {topic.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className={cn('font-serif text-ink', featured ? 'text-2xl leading-snug' : 'text-xl leading-snug')}>
          <Link href={`/articles/${topic.id}`} className="transition-colors duration-150 ease-gentle hover:text-brand">
            {topic.title}
          </Link>
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-body">{topic.excerpt}</p>

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-xs text-body">
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5" />
              {topic.readingTime} min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LayersIcon className="h-3.5 w-3.5" />
              {countSections(topic)} sections
            </span>
            <Link
              href={`/articles/${topic.id}`}
              className="ml-auto inline-flex items-center gap-1.5 font-medium text-brand transition-colors duration-150 ease-gentle hover:text-ink"
            >
              Read guide
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}