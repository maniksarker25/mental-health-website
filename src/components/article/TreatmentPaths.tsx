import React from 'react';
import type { Treatment } from '../../types/topic';

export function TreatmentPaths({ treatments }: {treatments: Treatment[];}) {
  return (
    <ul className="space-y-3">
      {treatments.map((treatment) =>
      <li key={treatment.name} className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-6 sm:flex-row sm:gap-6">
          <div className="sm:w-40 sm:shrink-0">
            <span className="inline-flex rounded-lg bg-brand-tint px-2.5 py-1 text-xs font-semibold tracking-wide text-brand">
              {treatment.abbreviation}
            </span>
          </div>
          <div>
            <h4 className="text-base font-semibold text-ink">{treatment.name}</h4>
            <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-body">{treatment.description}</p>
          </div>
        </li>
      )}
    </ul>);

}