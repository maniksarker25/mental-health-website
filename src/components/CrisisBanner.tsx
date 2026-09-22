import React from 'react';
import { HeartHandshakeIcon, MessageSquareIcon, PhoneCallIcon } from 'lucide-react';
import { crisisLines } from '../data/site';

export function CrisisBanner() {
  return (
    <section aria-labelledby="crisis-heading" className="border-t border-line pt-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand">
        <HeartHandshakeIcon className="h-3.5 w-3.5" />
        <span>Immediate help · 24/7</span>
      </div>

      <h2 id="crisis-heading" className="mt-3 max-w-2xl font-serif text-3xl leading-tight text-ink sm:text-4xl">
        If tonight feels unsurvivable, talk to someone now.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
        These lines are free, confidential, and staffed around the clock. You do not need to be in danger to use
        them — distress is reason enough.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {crisisLines.map((line) => (
          <li key={line.name} className="flex">
            <a
              href={line.target}
              className="flex h-full flex-col rounded-2xl border border-line bg-surface p-4 transition-transform duration-150 ease-gentle hover:scale-[1.01] hover:border-brand/40"
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                {line.action === 'call' ? (
                  <PhoneCallIcon className="h-4 w-4 text-brand" />
                ) : (
                  <MessageSquareIcon className="h-4 w-4 text-brand" />
                )}
                {line.contact}
              </span>
              <span className="mt-1.5 text-xs font-medium text-ink">{line.name}</span>
              <span className="mt-auto pt-3 text-xs leading-relaxed text-body">{line.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}