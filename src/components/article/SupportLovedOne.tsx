import React from 'react';
import { MessageCircleIcon, MessageCircleOffIcon } from 'lucide-react';
import type { Topic } from '../../types/topic';

export function SupportLovedOne({ support }: {support: Topic['support'];}) {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <p className="max-w-prose text-base leading-relaxed text-body lg:col-span-5">{support.guidance}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
        <div className="flex h-full flex-col rounded-3xl border border-mist-border bg-mist-bg p-5">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-mist-text">
            <MessageCircleIcon className="h-4 w-4" />
            Try saying
          </span>
          <ul className="mt-4 space-y-3">
            {support.say.map((line) =>
            <li key={line} className="text-sm leading-relaxed text-ink">
                {line}
              </li>
            )}
          </ul>
        </div>

        <div className="flex h-full flex-col rounded-3xl border border-blush-border bg-blush-bg p-5">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-blush-text">
            <MessageCircleOffIcon className="h-4 w-4" />
            Avoid
          </span>
          <ul className="mt-4 space-y-3">
            {support.avoid.map((line) =>
            <li key={line} className="text-sm leading-relaxed text-ink">
                {line}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>);

}