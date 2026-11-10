import type { Metadata } from 'next';
import { HelpCircleIcon } from 'lucide-react';
import { fetchPublicFaqs } from '../../lib/server/manageWeb';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — Mental Health Anonymous',
  description: 'Answers to frequently asked questions about Mental Health Anonymous.',
};

export default async function FaqPage() {
  try {
    const faqs = await fetchPublicFaqs();
    return (
      <main className="min-h-screen bg-canvas pb-20">
        <header className="border-b border-line bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand">
              <HelpCircleIcon className="h-3.5 w-3.5" />
              <span>Help Center</span>
            </div>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-body">
              Clear answers about using Mental Health Anonymous.
            </p>
          </div>
        </header>

        <section className="mx-auto max-w-3xl space-y-3 px-4 py-10 sm:px-6">
          {faqs.length ? (
            faqs.map((faq) => (
              <details
                key={faq._id}
                className="group rounded-2xl border border-line bg-surface p-5"
              >
                <summary className="cursor-pointer list-none font-semibold leading-relaxed text-ink marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="text-xl font-normal text-brand transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <div className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-body">
                  {faq.answer}
                </div>
              </details>
            ))
          ) : (
            <div className="rounded-2xl border border-line bg-surface p-6 text-sm text-body">
              FAQs have not been published yet.
            </div>
          )}
        </section>
      </main>
    );
  } catch (error) {
    console.error('Unable to load public FAQs:', error);
    return (
      <main className="min-h-[50vh] bg-canvas px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-surface p-8 text-center">
          <h1 className="font-serif text-3xl text-ink">FAQs temporarily unavailable</h1>
          <p className="mt-3 text-sm leading-relaxed text-body">
            We could not load the FAQs right now. Please try again later.
          </p>
        </div>
      </main>
    );
  }
}
