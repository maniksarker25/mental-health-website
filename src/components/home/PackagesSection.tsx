'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckIcon, ArrowRightIcon, SparklesIcon, ShieldCheckIcon, CheckCircle2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { packagesData, PackageTier } from '../../data/packages';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

export function PackagesSection() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [selectedPkg, setSelectedPkg] = useState<PackageTier | null>(null);

  const handlePurchase = (pkg: PackageTier) => {
    if (!isAuthenticated) {
      toast.info('Please sign in or create an account to purchase this package.');
      router.push(`/login?redirect=${encodeURIComponent('/#packages-section')}`);
      return;
    }

    // If logged in, show purchase confirmation
    setSelectedPkg(pkg);
  };

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
                <button
                  type="button"
                  onClick={() => handlePurchase(pkg)}
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition-all duration-150',
                    pkg.popular
                      ? 'bg-brand text-white hover:bg-brand-strong shadow-sm active:scale-[0.98]'
                      : 'border border-line bg-surface text-ink hover:border-brand hover:bg-brand-tint'
                  )}
                >
                  <span>{pkg.ctaLabel}</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Confirmation Modal (For Logged In Users) */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white mb-4">
              <CheckCircle2Icon className="h-6 w-6" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-ink">
              Confirm {selectedPkg.name} Package
            </h3>
            <p className="mt-2 text-xs text-body leading-relaxed">
              You are purchasing a 1-time anonymous dispatch packet for{' '}
              <strong className="text-ink font-semibold">${selectedPkg.price} USD</strong> as{' '}
              <strong className="text-ink font-semibold">{user?.email}</strong>.
            </p>

            <div className="mt-4 rounded-2xl border border-line bg-canvas p-4 text-xs space-y-2">
              <div className="flex justify-between text-body">
                <span>Tier</span>
                <span className="font-semibold text-ink">{selectedPkg.name}</span>
              </div>
              <div className="flex justify-between text-body">
                <span>Payment</span>
                <span className="font-semibold text-ink">One-Time · No subscription</span>
              </div>
              <div className="flex justify-between text-body border-t border-line pt-2">
                <span className="font-bold text-ink">Total Due</span>
                <span className="font-bold text-brand text-sm">${selectedPkg.price} USD</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedPkg(null)}
                className="flex-1 rounded-xl border border-line py-2.5 text-xs font-semibold text-body hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success(`Thank you! Your ${selectedPkg.name} package is ready for dispatch.`);
                  setSelectedPkg(null);
                  router.push('/#send-message-section');
                }}
                className="flex-1 rounded-xl bg-brand py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-strong"
              >
                Complete Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
