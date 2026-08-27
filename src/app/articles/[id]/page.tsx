import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { InfoIcon } from 'lucide-react';
import { getTopicById, topics } from '../../../data/topics';
import { ArticleHero } from '../../../components/article/ArticleHero';
import { ArticleSection } from '../../../components/article/ArticleSection';
import { SymptomsGrid } from '../../../components/article/SymptomsGrid';
import { MythsFacts } from '../../../components/article/MythsFacts';
import { StrategyCards } from '../../../components/article/StrategyCards';
import { TreatmentPaths } from '../../../components/article/TreatmentPaths';
import { SupportLovedOne } from '../../../components/article/SupportLovedOne';
import { FaqAccordion } from '../../../components/article/FaqAccordion';
import { BreathingPacer } from '../../../components/BreathingPacer';
import { CrisisBanner } from '../../../components/CrisisBanner';
import { TopicCard } from '../../../components/TopicCard';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return topics.map((topic) => ({
    id: topic.id,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const topic = getTopicById(id);

  if (!topic) {
    return {
      title: 'Guide Not Found — Mental Health Support',
    };
  }

  return {
    title: `${topic.title} — Mental Health Support`,
    description: topic.excerpt,
    keywords: topic.keywords,
    openGraph: {
      title: topic.title,
      description: topic.subtitle,
      images: [
        {
          url: topic.featuredImage,
          alt: topic.title,
        },
      ],
    },
  };
}

const contents = [
  { id: 'grounding', label: 'Grounding tool' },
  { id: 'overview', label: 'What is happening' },
  { id: 'signs', label: 'Signs to notice' },
  { id: 'myths', label: 'Myths vs facts' },
  { id: 'coping', label: 'Coping strategies' },
  { id: 'treatment', label: 'Treatment pathways' },
  { id: 'support', label: 'Supporting someone' },
  { id: 'faq', label: 'Questions' },
];

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { id } = await params;
  const topic = getTopicById(id);

  if (!topic) {
    notFound();
  }

  const related = topics.filter((item) => item.id !== topic.id).slice(0, 3);

  return (
    <article>
      <ArticleHero topic={topic} />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-16">
        <aside className="no-print lg:col-span-3">
          <nav aria-label="On this page" className="lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink">On this page</p>
            <ul className="mt-4 space-y-1.5">
              {contents.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-body transition-colors duration-150 ease-gentle hover:bg-brand-tint hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="space-y-14 lg:col-span-9">
          <section id="grounding" aria-labelledby="grounding-heading" className="scroll-mt-24">
            <p className="text-sm font-medium text-brand">Start here</p>
            <h2 id="grounding-heading" className="mt-3 max-w-2xl font-serif text-3xl leading-tight text-ink">
              A pacer you can use while you read.
            </h2>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-body">
              Choose a pace that suits the moment. If holding your breath feels uncomfortable, use a mode with a short
              or absent hold — the exhale is doing most of the work.
            </p>
            <div className="mt-8">
              <BreathingPacer presets={topic.pacer} showPresetPicker />
            </div>
          </section>

          <ArticleSection id="overview" eyebrow="Overview" title={topic.mechanics.heading}>
            <div className="max-w-prose space-y-5">
              {topic.intro.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-body">
                  {paragraph}
                </p>
              ))}
              <div className="rounded-3xl border border-line bg-surface p-6">
                <h3 className="font-serif text-xl text-ink">Symptom mechanics</h3>
                {topic.mechanics.body.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-sm leading-relaxed text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </ArticleSection>

          <ArticleSection
            id="signs"
            eyebrow="Signs & symptoms"
            title="What it looks like in the body, the mind, and the day"
            intro="These are patterns, not a diagnosis. Filter by where you notice them most."
          >
            <SymptomsGrid symptoms={topic.symptoms} />
          </ArticleSection>

          <ArticleSection
            id="myths"
            eyebrow="Myths vs facts"
            title="What people believe, and what the evidence says"
          >
            <MythsFacts items={topic.myths} />
          </ArticleSection>

          <ArticleSection
            id="coping"
            eyebrow="Coping strategies"
            title="Evidence-based tools you can try today"
            intro="Each of these is drawn from an established therapy protocol. Start with one and repeat it — a tool used badly twice beats a tool read about once."
          >
            <StrategyCards strategies={topic.strategies} />
          </ArticleSection>

          <ArticleSection
            id="treatment"
            eyebrow="Treatment pathways"
            title="What professional help actually looks like"
            intro="You do not need to know which of these you want before making an appointment. A clinician's first job is helping you choose."
          >
            <TreatmentPaths treatments={topic.treatments} />
          </ArticleSection>

          <ArticleSection
            id="support"
            eyebrow="For the people nearby"
            title="How to support a loved one"
          >
            <SupportLovedOne support={topic.support} />
          </ArticleSection>

          <ArticleSection id="faq" eyebrow="Questions" title="Frequently asked">
            <FaqAccordion faqs={topic.faqs} />
          </ArticleSection>

          <CrisisBanner />

          <aside className="flex gap-4 rounded-3xl border border-line bg-surface p-6">
            <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <div>
              <h2 className="text-base font-semibold text-ink">Medical disclaimer</h2>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-body">
                This guide is educational material, reviewed by a licensed clinician for accuracy. It is not a
                diagnosis, a treatment plan, or a substitute for individual care, and reading it does not create a
                clinician–patient relationship. Discuss any change to treatment or medication with a qualified
                professional. {topic.reviewer} · {topic.updated}.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <section aria-labelledby="related-heading" className="no-print border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <h2 id="related-heading" className="font-serif text-3xl text-ink">
            More guides you can dispatch
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <TopicCard key={item.id} topic={item} />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
