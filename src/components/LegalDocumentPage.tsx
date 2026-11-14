import { FileTextIcon, ShieldCheckIcon } from 'lucide-react';
import type { PublicLegalDocument } from '../types/manageWeb';

export function LegalDocumentPage({
  document,
  title,
  kind,
}: {
  document: PublicLegalDocument | null;
  title: string;
  kind: 'privacy' | 'terms';
}) {
  const Icon = kind === 'privacy' ? ShieldCheckIcon : FileTextIcon;

  return (
    <article className="min-h-screen bg-canvas pb-20">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand">
            <Icon className="h-3.5 w-3.5" />
            <span>Legal Information</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
            {title}
          </h1>
          {document && (
            <p className="mt-3 text-sm text-body">
              Last updated{' '}
              {new Intl.DateTimeFormat('en', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }).format(new Date(document.updatedAt))}
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {kind === 'privacy' && (
          <aside className="mb-8 rounded-2xl border border-sand-border bg-sand-bg p-5 text-sm leading-relaxed text-sand-text">
            <h2 className="font-semibold">How message dispatch data is handled</h2>
            <p className="mt-2">
              Sending a message creates a service record containing the sender account reference, recipient contact
              information, selected topic and resources, message note, and delivery status. This information is retained
              in service records and may be visible to authorized administrators. The sender&apos;s account identity is
              not included in the delivered email or SMS.
            </p>
          </aside>
        )}
        {document ? (
          <div
            className="html-content"
            dangerouslySetInnerHTML={{ __html: document.description }}
          />
        ) : (
          <div className="rounded-2xl border border-line bg-surface p-6 text-sm leading-relaxed text-body">
            This document has not been published yet.
          </div>
        )}
      </div>
    </article>
  );
}
