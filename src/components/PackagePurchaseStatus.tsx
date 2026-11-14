'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PurchaseStatus {
  purchaseId: string;
  packageTier: string;
  status: string;
  fulfillmentStatus: string;
}

export function PackagePurchaseStatus({ sessionId }: { sessionId: string }) {
  const [purchase, setPurchase] = useState<PurchaseStatus | null>(null);
  const [error, setError] = useState('');
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    let active = true;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;

    const checkStatus = async () => {
      try {
        const response = await fetch(
          `/api/package-purchase/session/${encodeURIComponent(sessionId)}`,
          { credentials: 'same-origin', cache: 'no-store' }
        );
        const result = await response.json() as {
          message?: string;
          error?: string;
          data?: PurchaseStatus;
        };
        if (!response.ok || !result.data) {
          throw new Error(result.error || result.message || 'Could not verify this purchase.');
        }
        if (!active) return;
        setPurchase(result.data);
        setError('');
        if (result.data.status === 'pending' && attempts < 40) {
          attempts += 1;
          timer = setTimeout(checkStatus, 3000);
        } else if (result.data.status === 'pending') {
          setTimedOut(true);
        }
      } catch (statusError) {
        if (!active) return;
        setError(statusError instanceof Error ? statusError.message : 'Could not verify this purchase.');
      }
    };

    void checkStatus();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [sessionId]);

  const isPaid = purchase?.status === 'completed';
  const hasUnusedCredit = isPaid && purchase.fulfillmentStatus === 'pending';

  return (
    <section className="bg-canvas px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-surface p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-medium text-brand">Package checkout</p>
        <h1 className="mt-3 font-serif text-3xl text-ink">
          {isPaid ? 'Payment confirmed' : 'Confirming your payment'}
        </h1>
        {hasUnusedCredit ? (
          <>
            <p className="mt-4 text-sm leading-relaxed text-body">
              Your {purchase.packageTier} package is confirmed. You can now use its one message credit.
              Payment is confirmed by Stripe, not by this return page.
            </p>
            <Link
              href={`/send-message?purchaseId=${encodeURIComponent(purchase.purchaseId)}&tier=${encodeURIComponent(purchase.packageTier)}`}
              className="mt-7 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
            >
              Prepare your message
            </Link>
          </>
        ) : isPaid ? (
          <>
            <p className="mt-4 text-sm leading-relaxed text-body">
              Payment is confirmed, but this package's message credit has already been used.
            </p>
            <Link href="/" className="mt-7 inline-flex rounded-full border border-line px-6 py-3 text-sm font-medium text-ink hover:border-brand">
              Return home
            </Link>
          </>
        ) : purchase && purchase.status !== 'pending' ? (
          <>
            <p role="alert" className="mt-4 text-sm leading-relaxed text-body">
              This payment is {purchase.status}. No message credit is available for this purchase.
            </p>
            <Link href="/packages" className="mt-7 inline-flex rounded-full border border-line px-6 py-3 text-sm font-medium text-ink hover:border-brand">
              Return to packages
            </Link>
          </>
        ) : (
          <>
            <p role="status" aria-live="polite" className="mt-4 text-sm leading-relaxed text-body">
              Stripe is processing the payment confirmation. This page checks the signed-in account’s purchase status.
              {timedOut ? ' Confirmation is taking longer than usual; you can return later and check your package again.' : ''}
            </p>
            {error && <p role="alert" className="mt-4 text-sm text-blush-text">{error}</p>}
            <Link href="/packages" className="mt-7 inline-flex rounded-full border border-line px-6 py-3 text-sm font-medium text-ink hover:border-brand">
              Return to packages
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
