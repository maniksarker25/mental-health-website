import type { Metadata } from 'next';
import { SendMessageWizard } from '../../components/SendMessageWizard';
import { fetchPublishedResources } from '../../lib/server/resources';
import { fetchPublicTopics } from '../../lib/server/topics';
import type { PublicResource } from '../../types/resource';
import type { PublicTopic } from '../../types/publicTopic';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Prepare a Message — Mental Health Anonymous',
  description:
    'Use a confirmed package credit to send an anonymous message by email or SMS.',
};

export default async function SendMessagePage({
  searchParams,
}: {
  searchParams: Promise<{
    topic?: string | string[];
    purchaseId?: string | string[];
    tier?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const topicId = Array.isArray(params.topic) ? params.topic[0] : params.topic;
  const packagePurchaseId = Array.isArray(params.purchaseId) ? params.purchaseId[0] : params.purchaseId;
  const packageTier = Array.isArray(params.tier) ? params.tier[0] : params.tier;
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
      initialTopicId={topicId}
      packagePurchaseId={packagePurchaseId}
      packageTier={packageTier}
      topics={topics}
      topicsUnavailable={topicsUnavailable}
      resources={resources}
      resourcesUnavailable={resourcesUnavailable}
    />
  );
}
