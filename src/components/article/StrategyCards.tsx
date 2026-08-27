import React from 'react';
import type { Strategy } from '../../types/topic';

export function StrategyCards({ strategies }: {strategies: Strategy[];}) {
  return (
    <ol className="grid gap-5 lg:grid-cols-3">
      {strategies.map((strategy, index) =>
      <li key={strategy.name} className="flex h-full flex-col rounded-3xl border border-line bg-surface p-6">
          <span className="font-serif text-2xl text-brand">{String(index + 1).padStart(2, '0')}</span>
          <h4 className="mt-3 font-serif text-xl leading-snug text-ink">{strategy.name}</h4>
          <p className="mt-2 text-sm leading-relaxed text-body">{strategy.summary}</p>
          <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
            {strategy.steps.map((step) =>
          <li key={step} className="flex gap-2.5 text-sm leading-relaxed text-body">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {step}
              </li>
          )}
          </ul>
        </li>
      )}
    </ol>);

}