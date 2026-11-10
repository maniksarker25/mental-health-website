import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../components/LegalDocumentPage';
import { fetchPublicLegalDocument } from '../../lib/server/manageWeb';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Privacy Policy — Mental Health Anonymous',
  description: 'Read the Mental Health Anonymous privacy policy.',
};

export default async function PrivacyPage() {
  try {
    const document = await fetchPublicLegalDocument('get-privacy-policy');
    return <LegalDocumentPage document={document} title="Privacy Policy" kind="privacy" />;
  } catch (error) {
    console.error('Unable to load public privacy policy:', error);
    return <LegalPageError title="Privacy Policy" />;
  }
}

function LegalPageError({ title }: { title: string }) {
  return (
    <main className="min-h-[50vh] bg-canvas px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-surface p-8 text-center">
        <h1 className="font-serif text-3xl text-ink">{title} temporarily unavailable</h1>
        <p className="mt-3 text-sm leading-relaxed text-body">
          We could not load this document right now. Please try again later.
        </p>
      </div>
    </main>
  );
}
