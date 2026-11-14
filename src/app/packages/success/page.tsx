import type { Metadata } from 'next';
import { PackagePurchaseStatus } from '../../../components/PackagePurchaseStatus';

export const metadata: Metadata = {
  title: 'Package Payment Status — Mental Health Anonymous',
  description: 'Check the status of your package payment.',
};

export default async function PackagePurchaseSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  const params = await searchParams;
  const sessionId = Array.isArray(params.session_id) ? params.session_id[0] : params.session_id;

  if (!sessionId) {
    return (
      <section className="bg-canvas px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-surface p-8 text-center">
          <h1 className="font-serif text-3xl text-ink">No checkout session found</h1>
          <p className="mt-3 text-sm text-body">Open your package checkout link again to verify a payment.</p>
        </div>
      </section>
    );
  }

  return <PackagePurchaseStatus sessionId={sessionId} />;
}
