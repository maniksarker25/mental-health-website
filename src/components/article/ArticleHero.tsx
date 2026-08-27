'use client';

import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeftIcon, ClockIcon, PrinterIcon, Share2Icon, ShieldCheckIcon } from 'lucide-react';
import type { Topic } from '../../types/topic';
import { toneStyles, topicIcons } from '../../utils/tone';
import { cn } from '../../utils/cn';

export function ArticleHero({ topic }: { topic: Topic }) {
  const tone = toneStyles[topic.tone];
  const Icon = topicIcons[topic.icon];

  async function copyLink() {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied. It contains no tracking parameters.');
    } catch {
      toast.error('Could not copy automatically — please copy the address bar.');
    }
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <img src={topic.featuredImage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(13,21,18,0.74)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Link
          href="/articles"
          className="no-print inline-flex items-center gap-2 text-sm text-white/80 transition-colors duration-150 ease-gentle hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          All guides
        </Link>

        <div className="mt-8 max-w-3xl">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
              tone.pill
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {topic.category}
          </span>

          <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-white sm:text-5xl">{topic.title}</h1>
          <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">{topic.subtitle}</p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-white/80">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1.5">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              {topic.reviewer} · {topic.updated}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5" />
              {topic.readingTime} min read
            </span>
          </div>

          <div className="no-print mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#18231f] transition-transform duration-150 ease-gentle hover:scale-[1.02]"
            >
              <Share2Icon className="h-4 w-4" />
              Share / copy link
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') window.print();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 ease-gentle hover:bg-white/10"
            >
              <PrinterIcon className="h-4 w-4" />
              Print resource
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}