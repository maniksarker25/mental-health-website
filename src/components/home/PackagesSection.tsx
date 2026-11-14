'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { packagesData } from '../../data/packages';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

interface PackageCredit {
  purchaseId: string;
  packageTier: string;
  paidAt?: string;
}

export function PackagesSection({ standalone = false }: { standalone?: boolean }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [checkoutTier, setCheckoutTier] = React.useState<string | null>(null);
  const [checkoutError, setCheckoutError] = React.useState('');
  const [credits, setCredits] = React.useState<PackageCredit[]>([]);
  const [creditsLoading, setCreditsLoading] = React.useState(false);
  const [creditsError, setCreditsError] = React.useState('');

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      setCredits([]);
      setCreditsLoading(false);
      setCreditsError('');
      return;
    }

    const controller = new AbortController();
    setCreditsLoading(true);
    fetch('/api/package-purchase/credits', {
      credentials: 'same-origin',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json() as {
          success?: boolean;
          message?: string;
          error?: string;
          data?: PackageCredit[];
        };
        if (!response.ok || result.success === false || !Array.isArray(result.data)) {
          throw new Error(result.error || result.message || 'Could not load your package credits.');
        }
        setCredits(result.data);
        setCreditsError('');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setCreditsError(error instanceof Error ? error.message : 'Could not load your package credits.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setCreditsLoading(false);
      });

    return () => controller.abort();
  }, [isAuthenticated, isAuthLoading]);

  const useCredit = (credit: PackageCredit) => {
    router.push(
      `/send-message?purchaseId=${encodeURIComponent(credit.purchaseId)}&tier=${encodeURIComponent(credit.packageTier)}`
    );
  };

  const startCheckout = async (packageTier: string) => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent('/packages')}`);
      return;
    }

    setCheckoutTier(packageTier);
    setCheckoutError('');
    try {
      const response = await fetch('/api/package-purchase/checkout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageTier }),
      });
      const result = await response.json() as {
        success?: boolean;
        message?: string;
        error?: string;
        data?: { checkoutUrl?: string };
      };
      if (!response.ok || result.success === false || !result.data?.checkoutUrl) {
        throw new Error(result.error || result.message || 'Could not start secure checkout.');
      }
      window.location.assign(result.data.checkoutUrl);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Could not start secure checkout.');
      setCheckoutTier(null);
    }
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
          {standalone ? (
            <h1
              id="packages-heading"
              className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl"
            >
              Simple packages for every support need.
            </h1>
          ) : (
            <h2
              id="packages-heading"
              className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl"
            >
              Simple packages for every support need.
            </h2>
          )}
          <p className="mt-4 text-base leading-relaxed text-body sm:text-lg">
            Each one-time package includes one anonymous message. Standard and Premium also include resource attachments; Premium includes a consultation.
          </p>
        </div>

        {isAuthenticated && (
          <div className="mx-auto mt-8 max-w-4xl">
            {creditsLoading ? (
              <p className="text-center text-sm text-body" role="status">Checking for unused package credits…</p>
            ) : creditsError ? (
              <p className="rounded-xl border border-blush-border bg-blush-bg p-4 text-sm text-blush-text" role="alert">
                {creditsError}
              </p>
            ) : credits.length > 0 ? (
              <div className="rounded-2xl border border-brand/30 bg-brand-tint/40 p-5 sm:p-6">
                <h2 className="font-serif text-xl text-ink">You have an unused package credit</h2>
                <p className="mt-1 text-sm text-body">
                  Continue with a purchase you already made—no need to pay again.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {credits.map((credit) => (
                    <button
                      key={credit.purchaseId}
                      type="button"
                      onClick={() => useCredit(credit)}
                      className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium capitalize text-white transition-colors hover:bg-brand-strong"
                    >
                      Use {credit.packageTier} credit <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* 3 Packages Cards */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:items-stretch">
          {packagesData.map((pkg) => {
            const credit = credits.find((item) => item.packageTier === pkg.id);
            return (
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

                  <div className="mt-6 flex items-baseline gap-1.5 border-b border-line pb-6">
                    <span className="font-serif text-5xl font-bold text-ink">
                      ${pkg.price}
                    </span>
                    <span className="text-xs font-medium text-body">One-time payment</span>
                  </div>

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
                    onClick={() => credit ? useCredit(credit) : void startCheckout(pkg.id)}
                    disabled={isAuthLoading || checkoutTier !== null || creditsLoading}
                    className={cn(
                      'inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60',
                      pkg.popular
                        ? 'bg-brand text-white hover:bg-brand-strong shadow-sm active:scale-[0.98]'
                        : 'border border-line bg-surface text-ink hover:border-brand hover:bg-brand-tint'
                    )}
                  >
                    <span>
                      {checkoutTier === pkg.id
                        ? 'Opening checkout…'
                        : credit
                          ? `Use ${pkg.name} credit`
                          : `Buy ${pkg.name}`}
                    </span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {checkoutError && (
          <p role="alert" className="mx-auto mt-6 max-w-2xl rounded-xl border border-blush-border bg-blush-bg p-4 text-sm text-blush-text">
            {checkoutError}
          </p>
        )}
      </div>
    </section>
  );
}
