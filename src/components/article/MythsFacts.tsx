import React from 'react';
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import type { MythFact } from '../../types/topic';

export function MythsFacts({ items }: {items: MythFact[];}) {
  return (
    <ul className="space-y-4">
      {items.map((item) =>
      <li key={item.myth} className="grid gap-0 overflow-hidden rounded-3xl border border-line md:grid-cols-2">
          <div className="flex gap-3 border-b border-line bg-blush-bg p-5 md:border-b-0 md:border-r">
            <XCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-blush-text" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-blush-text">Myth</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink">{item.myth}</p>
            </div>
          </div>
          <div className="flex gap-3 bg-surface p-5">
            <CheckCircle2Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-brand">Fact</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink">{item.fact}</p>
            </div>
          </div>
        </li>
      )}
    </ul>);

}