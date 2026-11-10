import { BackendRequestError, requestBackend } from './auth';
import type { PublicTopic, PublicTopicListResponse } from '../../types/publicTopic';
import type { Tone } from '../../types/topic';

const topicTones: Tone[] = ['sky', 'lavender', 'sand', 'blush', 'mist'];

function isPublicTopic(value: unknown): value is PublicTopic {
  if (typeof value !== 'object' || value === null) return false;
  if (!('_id' in value) || typeof value._id !== 'string') return false;
  if (!('name' in value) || typeof value.name !== 'string') return false;
  if (!('shortDescription' in value) || typeof value.shortDescription !== 'string') return false;
  if (!('tone' in value) || typeof value.tone !== 'string' || !topicTones.includes(value.tone as Tone)) {
    return false;
  }
  if (!('icon' in value) || typeof value.icon !== 'string') return false;
  return 'slug' in value && typeof value.slug === 'string';
}

export async function fetchPublicTopics(): Promise<PublicTopicListResponse> {
  const { body } = await requestBackend<PublicTopic[]>('topic?page=1&limit=100&sortBy=name&sortOrder=asc');
  if (!Array.isArray(body.data) || !body.data.every(isPublicTopic)) {
    throw new BackendRequestError('The topic API returned an invalid list.', 502);
  }

  const meta = (body as typeof body & { meta?: PublicTopicListResponse['meta'] }).meta;
  if (!meta || typeof meta.total !== 'number') {
    throw new BackendRequestError('The topic API returned invalid pagination data.', 502);
  }

  return {
    success: body.success !== false,
    message: body.message,
    data: body.data,
    meta,
  };
}
