'use client';

import React, { useState } from 'react';
import { ActivityIcon, BrainIcon, FootprintsIcon } from 'lucide-react';
import type { Symptom } from '../../types/topic';
import { cn } from '../../utils/cn';

const kindIcons = {
  Body: ActivityIcon,
  Mind: BrainIcon,
  Behavior: FootprintsIcon
} as const;

export function SymptomsGrid({ symptoms }: {symptoms: Symptom[];}) {
  const [activeKind, setActiveKind] = useState<'All' | Symptom['kind']>('All');
  const kinds: Array<'All' | Symptom['kind']> = ['All', 'Body', 'Mind', 'Behavior'];
  const visible = symptoms.filter((symptom) => activeKind === 'All' || symptom.kind === activeKind);

  return (
    <div>
      <div className="no-print flex flex-wrap gap-2" role="group" aria-label="Filter signs by type">
        {kinds.map((kind) =>
        <button
          key={kind}
          type="button"
          onClick={() => setActiveKind(kind)}
          aria-pressed={activeKind === kind}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-150 ease-gentle',
            activeKind === kind ?
            'border-brand bg-brand text-white' :
            'border-line bg-surface text-body hover:border-brand hover:text-ink'
          )}>
          
            {kind === 'All' ? 'All signs' : kind}
          </button>
        )}
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {visible.map((symptom) => {
          const Icon = kindIcons[symptom.kind];
          return (
            <li key={symptom.label} className="flex h-full flex-col rounded-3xl border border-line bg-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-tint text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-body">{symptom.kind}</span>
              </div>
              <h4 className="mt-4 text-[15px] font-semibold leading-snug text-ink">{symptom.label}</h4>
              <p className="mt-2 text-sm leading-relaxed text-body">{symptom.description}</p>
            </li>);

        })}
      </ul>
    </div>);

}