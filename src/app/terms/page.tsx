import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../components/LegalDocumentPage';
import { fetchPublicLegalDocument } from '../../lib/server/manageWeb';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Terms and Conditions — Mental Health Anonymous',
  description: 'Read the Mental Health Anonymous terms and conditions.',
};

export default async function TermsPage() {
  try {
    const document = await fetchPublicLegalDocument('get-terms-conditions');
    return (
      <LegalDocumentPage
        document={document}
        title="Terms and Conditions"
        kind="terms"
      />
    );
  } catch (error) {
    console.error('Unable to load public terms and conditions:', error);
    return (
      <main className="min-h-[50vh] bg-canvas px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-surface p-8 text-center">
          <h1 className="font-serif text-3xl text-ink">Terms and Conditions temporarily unavailable</h1>
          <p className="mt-3 text-sm leading-relaxed text-body">
            We could not load this document right now. Please try again later.
          </p>
        </div>
      </main>
    );
  }
}
