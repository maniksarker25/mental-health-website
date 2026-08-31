import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRightIcon, HeartHandshakeIcon, SparklesIcon, ShieldCheckIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — Mental Health Support',
  description:
    'Demystifying mental health support through zero-barrier, shame-free communication and clinically reviewed guides.',
};

export default function AboutPage() {
  return (
    <>
      {/* Header Banner */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand">
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>Our Mission</span>
          </div>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.12] text-ink sm:text-5xl lg:text-6xl">
            Demystifying mental health support through zero-barrier communication.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-body sm:text-lg">
            We exist for the gap between noticing that someone is struggling and knowing how to say it. Our mission is
            to make sending support gentle, private, and shame-free.
          </p>
        </div>
      </section>

      {/* The Problem & Impact Stats */}
      <section aria-labelledby="problem-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">Why We Started</span>
            <h2 id="problem-heading" className="mt-2 font-serif text-3xl leading-tight text-ink sm:text-4xl">
              When starting the conversation feels impossible, send support first.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-body sm:text-base">
              Most people who need support are not waiting for complex diagnostic checklists — they are waiting for permission to breathe and feel understood without judgment or pressure.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">
              An anonymous resource packet changes everything: the guidance arrives quietly before an awkward conversation does. It normalizes what the person is feeling and offers self-paced tools whenever they are ready.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { stat: '1 in 5', label: 'Adults navigate acute mental health challenges each year.' },
                { stat: '100%', label: 'Confidential and zero-retention delivery on every resource.' },
                { stat: '9+ Guides', label: 'Clinically vetted topics written in plain, empathetic language.' },
                { stat: '0 Accounts', label: 'No login, no sign-up wall, and no data tracking required.' },
              ].map((item) => (
                <div key={item.stat} className="rounded-3xl border border-line bg-surface p-6 shadow-xs">
                  <p className="font-serif text-3xl font-bold text-brand">{item.stat}</p>
                  <p className="mt-2 text-xs leading-relaxed text-body">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder & Leadership Section */}
      <section className="border-t border-line bg-surface py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Founder Image */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-line bg-canvas shadow-lg">
                <img
                  src="/2c24f0fa-868a-4068-8e48-996bef5a7078.jpg"
                  alt="Founder & Clinical Director"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-line bg-surface/95 p-4 backdrop-blur-md">
                  <h3 className="font-serif text-lg font-bold text-ink">David Vance</h3>
                  <p className="text-xs text-brand font-medium">Founder & Mental Health Advocate</p>
                </div>
              </div>
            </div>

            {/* Founder Story & Vision */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand">
                <HeartHandshakeIcon className="h-3.5 w-3.5" />
                <span>Leadership & Vision</span>
              </div>

              <h2 className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
                “Everyone deserves access to calm, shame-free mental health support.”
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-body sm:text-base">
                <p>
                  David founded this initiative after witnessing firsthand how stigma, fear of vulnerability, and complicated healthcare systems prevent people from getting support when they need it most.
                </p>
                <p>
                  With years of dedication to community wellness and digital accessibility, David envisioned a quiet platform that strips away all barriers — no passwords, no personal profiles, and no judgment.
                </p>
                <p>
                  Today, our clinically reviewed guides and anonymous messaging tools empower thousands of individuals and families to take the first gentle step toward healing.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Get in touch with us</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-brand hover:bg-brand-tint"
                >
                  Explore support resources
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
