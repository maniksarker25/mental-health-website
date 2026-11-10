import { HeartHandshakeIcon } from 'lucide-react';
import { BreathingPacer } from '@/src/components/BreathingPacer';
import { ResourceLibrary } from '@/src/components/ResourceLibrary';
import { fetchPublishedResources } from '@/src/lib/server/resources';
import type { PublicResource } from '@/src/types/resource';

export const dynamic = 'force-dynamic';

const resourcesPacer = [
  {
    label: '4-7-8 calming',
    inhale: 4,
    hold: 7,
    exhale: 8,
    description:
      'If you arrived here mid-spike, start with this. Four seconds in, hold for seven, out for eight — the long exhale is what tells your body the emergency is over.',
  },
];

export default async function ResourcesPage() {
  let resources: PublicResource[] = [];
  let loadError = false;

  try {
    const result = await fetchPublishedResources({ limit: 100 });
    resources = result.data;
  } catch (error) {
    console.error('Unable to load public resources:', error);
    loadError = true;
  }

  return (
    <>
      {loadError ? (
        <section className="border-b border-line bg-canvas">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand">
              <HeartHandshakeIcon className="h-3.5 w-3.5" />
              <span>Mental Health Library</span>
            </div>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
              Resources are temporarily unavailable.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-body">
              We could not load the resource library right now. Please try again in a little while.
            </p>
          </div>
        </section>
      ) : (
        <ResourceLibrary resources={resources} />
      )}

      <section aria-labelledby="pacer-heading" className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-brand">Relief right now</p>
            <h2
              id="pacer-heading"
              className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl"
            >
              Before you read anything else, take four breaths.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-body">
              Nothing to install, nothing to sign up for. Follow the circle — it expands as you
              breathe in and contracts as you breathe out.
            </p>
          </div>
          <div className="mt-10">
            <BreathingPacer presets={resourcesPacer} />
          </div>
        </div>
      </section>
    </>
  );
}
