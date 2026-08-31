import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ArrowLeftIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from 'lucide-react';
import { getTopicById, topics } from '../../../data/topics';
import { BreathingPacer } from '../../../components/BreathingPacer';
import type { Topic } from '../../../types/topic';

interface ResourcePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return topics.map((topic) => ({
    id: topic.id,
  }));
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { id } = await params;
  const topic = getTopicById(id);

  if (!topic) {
    return {
      title: 'Resource Not Found — Mental Health Support',
    };
  }

  return {
    title: `${topic.title} — Mental Health Support`,
    description: topic.excerpt,
    keywords: topic.keywords,
  };
}

/**
 * Returns the HTML content string (supports HTML output from Jodit Editor / DB).
 * If topic.contentHtml is already provided, it uses it directly.
 * Otherwise, it formats the topic data into clean semantic HTML.
 */
function getTopicHtml(topic: Topic): string {
  if (topic.contentHtml) {
    return topic.contentHtml;
  }

  const sections: string[] = [];

  // Overview
  if (topic.intro && topic.intro.length > 0) {
    sections.push(`<h2>Overview</h2>`);
    topic.intro.forEach((p) => {
      sections.push(`<p>${p}</p>`);
    });
  }

  // Mechanics
  if (topic.mechanics) {
    sections.push(`<h2>${topic.mechanics.heading}</h2>`);
    topic.mechanics.body.forEach((p) => {
      sections.push(`<p>${p}</p>`);
    });
  }

  // Symptoms & Signs
  if (topic.symptoms && topic.symptoms.length > 0) {
    sections.push(`<h2>Signs &amp; Patterns to Notice</h2>`);
    sections.push(`<p>These are common patterns and bodily stress responses rather than a formal diagnosis:</p>`);
    sections.push(`<ul>`);
    topic.symptoms.forEach((s) => {
      sections.push(
        `<li><strong>[${s.kind}] ${s.label}:</strong> ${s.description}</li>`
      );
    });
    sections.push(`</ul>`);
  }

  // Myths vs Facts
  if (topic.myths && topic.myths.length > 0) {
    sections.push(`<h2>What People Believe vs. What Evidence Shows</h2>`);
    topic.myths.forEach((m) => {
      sections.push(`
        <blockquote>
          <p><strong>Myth:</strong> “${m.myth}”</p>
          <p><strong>Fact:</strong> ${m.fact}</p>
        </blockquote>
      `);
    });
  }

  // Evidence-Based Coping Strategies
  if (topic.strategies && topic.strategies.length > 0) {
    sections.push(`<h2>Practical Coping Strategies</h2>`);
    topic.strategies.forEach((strat) => {
      sections.push(`<h3>${strat.name}</h3>`);
      sections.push(`<p>${strat.summary}</p>`);
      sections.push(`<ol>`);
      strat.steps.forEach((step) => {
        sections.push(`<li>${step}</li>`);
      });
      sections.push(`</ol>`);
    });
  }

  // Supporting a Loved One
  if (topic.support && (topic.support.say?.length || topic.support.avoid?.length)) {
    sections.push(`<h2>How to Support Someone Nearby</h2>`);
    if (topic.support.say?.length) {
      sections.push(`<h3>Helpful phrases to say:</h3>`);
      sections.push(`<ul>`);
      topic.support.say.forEach((s) => {
        sections.push(`<li>“${s}”</li>`);
      });
      sections.push(`</ul>`);
    }
    if (topic.support.avoid?.length) {
      sections.push(`<h3>Phrases to avoid:</h3>`);
      sections.push(`<ul>`);
      topic.support.avoid.forEach((a) => {
        sections.push(`<li>“${a}”</li>`);
      });
      sections.push(`</ul>`);
    }
  }

  // FAQs
  if (topic.faqs && topic.faqs.length > 0) {
    sections.push(`<h2>Common Questions</h2>`);
    topic.faqs.forEach((faq) => {
      sections.push(`
        <div style="margin-bottom: 1.25rem;">
          <p><strong>${faq.question}</strong></p>
          <p>${faq.answer}</p>
        </div>
      `);
    });
  }

  return sections.join('\n');
}

export default async function ResourceDetailPage({ params }: ResourcePageProps) {
  const { id } = await params;
  const topic = getTopicById(id);

  if (!topic) {
    notFound();
  }

  const contentHtml = getTopicHtml(topic);
  const related = topics.filter((item) => item.id !== topic.id).slice(0, 3);

  return (
    <article className="min-h-screen bg-canvas pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-xs font-medium text-body transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back to all resources
          </Link>
          <div className="flex items-center gap-2 text-xs text-brand font-medium">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            <span>Clinically Vetted</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header className="border-b border-line bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center gap-3 text-xs text-body">
            <span className="rounded-full bg-brand-tint px-3 py-1 font-medium text-brand">
              {topic.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              {topic.readingTime} min read
            </span>
            <span>·</span>
            <span>{topic.updated}</span>
          </div>

          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
            {topic.title}
          </h1>

          <p className="mt-4 font-serif text-lg leading-relaxed text-body sm:text-xl">
            {topic.subtitle}
          </p>
        </div>
      </header>

      {/* Main Article Container */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* 1. Essential Breathing Pacer Section */}
        {topic.pacer && topic.pacer.length > 0 && (
          <section className="mb-12 rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
              <SparklesIcon className="h-4 w-4" />
              <span>Grounding &amp; Breathing Tool</span>
            </div>
            <h2 className="mt-2 font-serif text-2xl font-bold text-ink">
              Take a moment to calm your breathing first.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Follow the expanding and contracting rhythm below to signal your nervous system that the acute alarm is over.
            </p>
            <div className="mt-6">
              <BreathingPacer presets={topic.pacer} showPresetPicker />
            </div>
          </section>
        )}

        {/* 2. Rich HTML Content (Jodit Editor / Database Format) */}
        <div
          className="html-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Next / Related Guides */}
        <div className="mt-14 border-t border-line pt-10">
          <h3 className="font-serif text-xl font-bold text-ink">
            Related Resources
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/resources/${rel.id}`}
                className="rounded-2xl border border-line bg-surface p-4 text-xs transition-colors hover:border-brand"
              >
                <p className="font-semibold text-brand uppercase tracking-wider text-[10px]">
                  {rel.category}
                </p>
                <p className="mt-1 font-serif font-bold text-ink text-sm leading-snug line-clamp-2">
                  {rel.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
