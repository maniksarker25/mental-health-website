import type { Metadata } from 'next';
import { SendMessageWizard } from '../../components/SendMessageWizard';
import { packagesData } from '../../data/packages';
import { fetchPublishedResources } from '../../lib/server/resources';
import { fetchPublicTopics } from '../../lib/server/topics';
import type { PublicResource } from '../../types/resource';
import type { PublicTopic } from '../../types/publicTopic';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Prepare a Message — Mental Health Anonymous',
  description:
    'Choose a mental health topic and published resources, add recipient details, and review your message dispatch preview.',
};

export default async function SendMessagePage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string | string[]; topic?: string | string[] }>;
}) {
  const params = await searchParams;
  const packageId = Array.isArray(params.package) ? params.package[0] : params.package;
  const topicId = Array.isArray(params.topic) ? params.topic[0] : params.topic;
  const initialPackageId = packagesData.some((item) => item.id === packageId) ? packageId : undefined;
  let topics: PublicTopic[] = [];
  let topicsUnavailable = false;
  let resources: PublicResource[] = [];
  let resourcesUnavailable = false;

  try {
    const result = await fetchPublicTopics();
    topics = result.data;
  } catch (error) {
    console.error('Unable to load public topics:', error);
    topicsUnavailable = true;
  }

  try {
    const result = await fetchPublishedResources({ limit: 100 });
    resources = result.data;
  } catch (error) {
    console.error('Unable to load message resources:', error);
    resourcesUnavailable = true;
  }

  return (
    <SendMessageWizard
      initialPackageId={initialPackageId}
      initialTopicId={topicId}
      topics={topics}
      topicsUnavailable={topicsUnavailable}
      resources={resources}
      resourcesUnavailable={resourcesUnavailable}
    />
  );
}
