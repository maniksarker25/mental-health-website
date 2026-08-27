import React from 'react';
import { CookieIcon, DatabaseIcon, FingerprintIcon, UserXIcon } from 'lucide-react';

const guarantees = [
{
  title: 'No IP logging',
  body: 'Requests are handled in memory and never written to a log file. We cannot tell you where a dispatch came from because we never learn it.',
  icon: FingerprintIcon
},
{
  title: 'No accounts for recipients',
  body: 'A resource link opens straight into the guide. No email capture, no sign-up wall, no “verify to continue”.',
  icon: UserXIcon
},
{
  title: 'No stored personal data',
  body: 'Phone numbers and email addresses are used once to deliver the link and are then discarded — not archived, not hashed for later.',
  icon: DatabaseIcon
},
{
  title: 'No third-party trackers',
  body: 'No analytics scripts, advertising pixels, or cross-site cookies anywhere on this site, including the guides themselves.',
  icon: CookieIcon
}];


export function PrivacySection() {
  return (
    <section aria-labelledby="privacy-heading" className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
        <div className="lg:col-span-5">
          <p className="text-sm font-medium text-brand">Safety architecture</p>
          <h2 id="privacy-heading" className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
            Zero retention is a design constraint, not a policy promise.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-body">
            The safest data is the data that was never collected. We built dispatch so that there is nothing to leak,
            subpoena, or sell — and so that nobody has to trust our intentions to trust the service.
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {guarantees.map((item) =>
          <div key={item.title} className="rounded-3xl border border-line bg-canvas p-5">
              <item.icon className="h-5 w-5 text-brand" />
              <dt className="mt-4 text-base font-semibold text-ink">{item.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-body">{item.body}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>);

}