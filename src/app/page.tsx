import React from 'react';
import { HomeHero } from '../components/home/HomeHero';
import { HowItWorksVideoSection } from '../components/home/HowItWorksVideoSection';
import { AnonymousMessagingSteps } from '../components/home/AnonymousMessagingSteps';
import { PackagesSection } from '../components/home/PackagesSection';
import { AppDownloadSection } from '../components/home/AppDownloadSection';
import { BreathingPacer } from '../components/BreathingPacer';

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
  return (
    <>
      {/* 1. Hero Banner */}
      <HomeHero />

      {/* 2. How-it-Works Video Section */}
      <HowItWorksVideoSection />

      {/* 3. Anonymous Messaging Steps */}
      <AnonymousMessagingSteps />

      {/* 4. Instant Grounding Breathing Pacer */}
      <section aria-labelledby="pacer-heading" className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
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

      {/* 5. Packages & Pricing (3 Packages) */}
      <PackagesSection />

      {/* 6. App Download Information */}
      <AppDownloadSection />
    </>
  );
}
