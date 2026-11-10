import { BackendRequestError, requestBackend } from './auth';
import type {
  PublicResource,
  PublicResourceListResponse,
  PublicResourceResponse,
} from '../../types/resource';

export async function fetchPublishedResources(params: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  topic?: string;
} = {}): Promise<PublicResourceListResponse> {
  const search = new URLSearchParams({
    status: 'published',
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 100),
  });
  if (params.searchTerm) search.set('searchTerm', params.searchTerm);
  if (params.topic) search.set('topic', params.topic);

  const { body } = await requestBackend<PublicResource[]>(
    `resource?${search.toString()}`
  );
  if (!Array.isArray(body.data)) {
    throw new BackendRequestError('The resource API returned an invalid list.', 502);
  }
  const meta = (body as typeof body & { meta?: PublicResourceListResponse['meta'] }).meta;
  if (!meta) {
    throw new BackendRequestError('The resource API returned invalid pagination data.', 502);
  }
  return {
    success: body.success !== false,
    message: body.message,
    data: body.data,
    meta,
  };
}

export async function fetchPublishedResource(
  idOrSlug: string
): Promise<PublicResource | null> {
  try {
    const { body } = await requestBackend<PublicResource>(
      `resource/${encodeURIComponent(idOrSlug)}`
    );
    if (!body.data || typeof body.data !== 'object') {
      throw new BackendRequestError('The resource API returned an invalid resource.', 502);
    }
    return (body as PublicResourceResponse).data;
  } catch (error) {
    if (error instanceof BackendRequestError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
