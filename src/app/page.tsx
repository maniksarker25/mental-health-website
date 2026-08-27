import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { HomeHero } from '../components/home/HomeHero';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { PrivacySection } from '../components/home/PrivacySection';
import { AppDownloadSection } from '../components/home/AppDownloadSection';
import { BreathingPacer } from '../components/BreathingPacer';
import { TopicCard } from '../components/TopicCard';
import { CrisisBanner } from '../components/CrisisBanner';
import { topics } from '../data/topics';

const homePacer = [
  {
    label: '4-7-8 calming',
    inhale: 4,
    hold: 7,
    exhale: 8,
    description:
      'If you arrived here mid-spike, start with this. Four seconds in, hold for seven, out for eight — the long exhale is what tells your body the emergency is over.',
  },
];

export default function HomePage() {
  const [lead, ...rest] = topics;
  const featured = rest.slice(0, 3);

  return (
    <>
      <HomeHero />
      <HowItWorksSection />

      <section aria-labelledby="pacer-heading" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-brand">Relief right now</p>
            <h2 id="pacer-heading" className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
              Before you read anything else, take four breaths.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-body">
              Nothing to install, nothing to sign up for. Follow the circle — it expands as you breathe in and contracts
              as you breathe out.
            </p>
          </div>
          <div className="mt-10">
            <BreathingPacer presets={homePacer} />
          </div>
        </div>
      </section>

      <section aria-labelledby="featured-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-brand">Guides & articles</p>
            <h2 id="featured-heading" className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
              Start with the one that sounds like the person you are worried about.
            </h2>
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors duration-150 ease-gentle hover:text-ink"
          >
            All {topics.length} guides
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TopicCard topic={lead} featured />
          </div>
          {featured.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
          <Link
            href="/articles"
            className="flex flex-col justify-between rounded-3xl border border-dashed border-line bg-surface p-6 transition-colors duration-150 ease-gentle hover:border-brand"
          >
            <div>
              <h3 className="font-serif text-xl text-ink">Browse the full catalogue</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-body">
                Search by symptom or keyword and filter by category — anxiety, sleep, OCD, grief, substance use and
                more.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand">
              Open the catalogue
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>

      <AppDownloadSection />

      <PrivacySection />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <CrisisBanner />
      </div>
    </>
  );
}
