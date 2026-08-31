'use client';

import React from 'react';
import { BookOpenIcon, SendIcon, HeartHandshakeIcon, LockIcon } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Choose a clinically vetted topic',
    description:
      'Select a guide tailored to what they are facing — Anxiety & Panic, Burnout, Depression, Sleep, or Grief. Written in calm, accessible language without pathologizing.',
    icon: BookOpenIcon,
    detail: '9 guides reviewed quarterly by licensed clinicians',
  },
  {
    number: '02',
    title: 'Select SMS or Email dispatch',
    description:
      'We generate an ephemeral, tracking-free link. No sender name is attached, no IP is stored, and no user profile is created. It is completely anonymous.',
    icon: SendIcon,
    detail: 'Zero retention guarantee — memory-only processing',
  },
  {
    number: '03',
    title: 'They read at their own pace',
    description:
      'The recipient opens a quiet, ad-free page featuring practical grounding tools, symptom mechanics, coping strategies, and verified crisis helplines.',
    icon: HeartHandshakeIcon,
    detail: 'No account required, no read receipts, no follow-up pressure',
  },
];

export function AnonymousMessagingSteps() {
  return (
    <section
      id="anonymous-steps"
      aria-labelledby="steps-heading"
      className="border-b border-line bg-canvas py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-brand">
            <LockIcon className="h-3.5 w-3.5" />
            <span>Anonymous Messaging Protocol</span>
          </div>
          <h2
            id="steps-heading"
            className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl"
          >
            How anonymous messaging works from start to finish.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-body sm:text-lg">
            When emotional distress makes direct conversations overwhelming, you can send help without putting anyone
            on the spot. Here are the three simple steps.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="group relative flex flex-col justify-between rounded-3xl border border-line bg-surface p-6 transition-all duration-200 hover:border-brand/50 hover:shadow-md sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-tint text-brand">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-2xl font-bold text-ink/20 group-hover:text-brand/40 transition-colors">
                      {item.number}
                    </span>
                  </div>
                  <h3 className="mt-6 font-serif text-xl text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-body">{item.description}</p>
                </div>
                <div className="mt-8 border-t border-line pt-4">
                  <p className="text-xs font-medium text-brand">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
