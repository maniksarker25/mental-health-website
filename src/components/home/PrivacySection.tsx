import React from 'react';
import { CreditCardIcon, DatabaseIcon, FingerprintIcon, UserXIcon } from 'lucide-react';

const guarantees = [
{
  title: 'Sender identity stays private from recipients',
  body: 'The sender’s account identity is not included in the delivered message.',
  icon: FingerprintIcon
},
{
  title: 'Account required to send',
  body: 'Only signed-in users can submit a message for delivery.',
  icon: UserXIcon
},
{
  title: 'Dispatch information is retained',
  body: 'The sender account reference, recipient contact details, selected resources, and message content are stored in service records.',
  icon: DatabaseIcon
},
{
  title: 'No payment required',
  body: 'Message sending is currently free. A payment is not taken when submitting a dispatch.',
  icon: CreditCardIcon
}];


export function PrivacySection() {
  return (
    <section aria-labelledby="privacy-heading" className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
        <div className="lg:col-span-5">
          <p className="text-sm font-medium text-brand">Message privacy</p>
          <h2 id="privacy-heading" className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
            Anonymous to the recipient. Transparent about service records.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-body">
            The recipient does not see the sender’s account identity. To send and support a dispatch, the service
            stores the sender account reference, recipient contact details, and message content.
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