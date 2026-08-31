'use client';

import React from 'react';
import Link from 'next/link';
import { CheckIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { packagesData } from '../../data/packages';
import { cn } from '../../utils/cn';

export function PackagesSection() {
  return (
    <section
      id="packages-section"
      aria-labelledby="packages-heading"
      className="border-b border-line bg-surface py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand">
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>Packages & Pricing</span>
          </div>
          <h2
            id="packages-heading"
            className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl"
          >
            Simple packages for every support need.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-body sm:text-lg">
            One-time purchase per dispatch with no subscriptions, recurring fees, or hidden commitments.
          </p>
        </div>

        {/* 3 Packages Cards */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:items-stretch">
          {packagesData.map((pkg) => (
            <div
              key={pkg.id}
              className={cn(
                'relative flex flex-col justify-between rounded-3xl border p-6 transition-all duration-200 sm:p-8',
                pkg.popular
                  ? 'border-brand bg-canvas ring-2 ring-brand/30 shadow-lg'
                  : 'border-line bg-surface hover:border-brand/40'
              )}
            >
              {pkg.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                  {pkg.badge}
                </span>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-ink">{pkg.name}</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-body">{pkg.tagline}</p>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1.5 border-b border-line pb-6">
                  <span className="font-serif text-5xl font-bold text-ink">
                    ${pkg.price}
                  </span>
                  <span className="text-xs font-medium text-body">USD (one-time)</span>
                </div>

                {/* Features */}
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink">What is included:</p>
                  <ul className="mt-4 space-y-3">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs leading-relaxed text-body">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 border-t border-line pt-6">
                <Link
                  href={pkg.ctaHref}
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition-all duration-150',
                    pkg.popular
                      ? 'bg-brand text-white hover:bg-brand-strong shadow-sm active:scale-[0.98]'
                      : 'border border-line bg-surface text-ink hover:border-brand hover:bg-brand-tint'
                  )}
                >
                  <span>{pkg.ctaLabel}</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
