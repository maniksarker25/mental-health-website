'use client';

import React from 'react';
import { CheckIcon, UsersIcon } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Choose a topic',
    description:
      'Start with a topic that fits the kind of support you want to share.',
    detail: 'Choose from the available mental health topics',
  },
  {
    number: '02',
    title: 'Add recipient and delivery details',
    description:
      'Enter the recipient contact and choose email or SMS. You can review your choices before finishing.',
    detail: 'Recipient details stay in the page preview',
  },
  {
    number: '03',
    title: 'Review the dispatch preview',
    description:
      'The website currently provides a guided preview only. Message delivery and payment are not connected yet.',
    detail: 'Nothing is sent or saved when you finish',
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
        <div className="mx-auto max-w-3xl text-center">
          <div className="max-w-3xl ">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-brand">
              <UsersIcon className="h-3.5 w-3.5" />
              <span>Anonymous Messaging Protocol</span>
            </div>
            <h2
              id="steps-heading"
              className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl"
            >
              Prepare a message, one step at a time.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body sm:text-lg">
              Choose a topic, enter recipient details, and review your delivery choice. Actual message delivery is not available yet.
            </p>
          </div>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
          {steps.map((item) => (
            <div
              key={item.number}
              className="group relative flex flex-col justify-between rounded-3xl border border-line bg-surface p-6 transition-all duration-200 hover:border-brand/50 hover:shadow-md sm:p-8"
            >
              <div>
                <span className="font-serif text-3xl text-brand sm:text-4xl">{item.number}</span>
                <h3 className="mt-4 font-serif text-xl text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-body">{item.description}</p>
              </div>
              <div className="mt-8 flex items-start gap-2 border-t border-line pt-4">
                <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                <p className="text-xs font-medium text-body">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
