import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import { advisors, commitments } from '../../data/site';
import { CrisisBanner } from '../../components/CrisisBanner';

export const metadata: Metadata = {
  title: 'About Us — Mental Health Support',
  description:
    'Demystifying mental health support through zero-barrier, shame-free communication and clinically reviewed guides.',
};

const reviewCycle = [
  {
    stage: 'Drafted from evidence',
    body: 'A clinician-writer pair drafts each guide from current guidelines and peer-reviewed literature, citing nothing we cannot verify.',
  },
  {
    stage: 'Plain-language rewrite',
    body: 'Every claim is rewritten at roughly a 7th-grade reading level, without softening the clinical accuracy.',
  },
  {
    stage: 'Licensed clinical review',
    body: 'A PsyD, MD, or LCSW reviews the guide for accuracy, tone, and risk language before it can publish.',
  },
  {
    stage: 'Quarterly re-review',
    body: 'Guides are re-checked every quarter and republished with a visible review date, or pulled if they fall behind.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-medium text-brand">About us</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.12] text-ink sm:text-5xl">
            Demystifying mental health support through zero-barrier, shame-free communication.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-body">
            We exist for the gap between noticing that someone is struggling and knowing how to say it. Our job is to
            make the first move cost almost nothing — no confrontation, no diagnosis, no disclosure, no data.
          </p>
        </div>
      </section>

      <section aria-labelledby="problem-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="problem-heading" className="font-serif text-3xl leading-tight text-ink sm:text-4xl">
              The problem we solve
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-body">
              Most people who need help are not waiting for information — they are waiting for permission. Bringing it
              up risks the relationship, invites a label, and often lands as an accusation. So the conversation gets
              postponed, sometimes for years.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-body">
              An anonymous resource packet changes the sequence. The material arrives before the conversation does. It
              explains the mechanics, normalises the symptoms, and offers a next step — with nobody standing over the
              reader waiting for a response.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { stat: '1 in 5', label: 'US adults experience a mental illness in a given year.' },
                { stat: '~11 years', label: 'Average delay between symptom onset and first treatment contact.' },
                { stat: '0 bytes', label: 'Personal data we retain after a resource is dispatched.' },
                { stat: '9 guides', label: 'Reviewed quarterly by licensed clinicians, free to print and share.' },
              ].map((item) => (
                <div key={item.stat} className="rounded-3xl border border-line bg-surface p-6">
                  <p className="font-serif text-3xl text-brand">{item.stat}</p>
                  <p className="mt-2 text-sm leading-relaxed text-body">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="framework-heading" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-brand">Clinical advisory framework</p>
            <h2 id="framework-heading" className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
              Nothing publishes without a licensed clinician’s name on it.
            </h2>
          </div>

          <ol className="mt-12 space-y-4">
            {reviewCycle.map((item, index) => (
              <li key={item.stage} className="flex gap-5 rounded-3xl border border-line bg-canvas p-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-tint font-medium text-brand">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">{item.stage}</h3>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-body">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {advisors.map((advisor) => (
              <div key={advisor.name} className="flex h-full flex-col rounded-3xl border border-line bg-canvas p-5">
                <h3 className="text-sm font-semibold text-ink">{advisor.name}</h3>
                <p className="mt-1 text-xs font-medium text-brand">{advisor.role}</p>
                <p className="mt-auto pt-3 text-xs leading-relaxed text-body">{advisor.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="ethics-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="ethics-heading" className="font-serif text-3xl leading-tight text-ink sm:text-4xl">
              Ethical commitments
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-body">
              These are structural, not aspirational. Each one removes a capability from the product so it cannot be
              reintroduced quietly later.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-transform duration-150 ease-gentle hover:scale-[1.02]"
            >
              Work with our clinical team
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <ul className="grid gap-4 lg:col-span-7">
            {commitments.map((item) => (
              <li key={item.title} className="flex gap-4 rounded-3xl border border-line bg-surface p-6">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-body">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <CrisisBanner />
      </div>
    </>
  );
}
