import React from 'react';
import { MessageSquareIcon, PhoneCallIcon } from 'lucide-react';
import { crisisLines } from '../data/site';

export function CrisisBanner() {
  return (
    <section aria-labelledby="crisis-heading" className="rounded-3xl border border-blush-border bg-blush-bg p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-blush-text">Immediate help · 24/7</p>
          <h2 id="crisis-heading" className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
            If tonight feels unsurvivable, talk to someone now.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            These lines are free, confidential, and staffed around the clock. You do not need to be in danger to use
            them — distress is reason enough.
          </p>
        </div>

        <ul className="grid flex-1 gap-3 sm:grid-cols-3 lg:max-w-2xl">
          {crisisLines.map((line) =>
          <li key={line.name} className="flex">
              <a
              href={line.target}
              className="flex h-full flex-col rounded-2xl border border-blush-border bg-surface p-4 transition-transform duration-150 ease-gentle hover:scale-[1.01]">
              
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  {line.action === 'call' ?
                <PhoneCallIcon className="h-4 w-4 text-blush-text" /> :

                <MessageSquareIcon className="h-4 w-4 text-blush-text" />
                }
                  {line.contact}
                </span>
                <span className="mt-1.5 text-xs font-medium text-ink">{line.name}</span>
                <span className="mt-auto pt-3 text-xs leading-relaxed text-body">{line.description}</span>
              </a>
            </li>
          )}
        </ul>
      </div>
    </section>);

}