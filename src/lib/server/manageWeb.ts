import { BackendRequestError, requestBackend } from './auth';
import type {
  PublicFaq,
  PublicLegalDocument,
} from '../../types/manageWeb';

export async function fetchPublicLegalDocument(
  endpoint: 'get-privacy-policy' | 'get-terms-conditions'
): Promise<PublicLegalDocument | null> {
  const { body } = await requestBackend<PublicLegalDocument | null>(`manage/${endpoint}`);
  const document = body.data;
  if (document === undefined) {
    throw new BackendRequestError('The legal document API returned an empty response.', 502);
  }
  if (document === null) return null;
  if (
    typeof document !== 'object' ||
    typeof document._id !== 'string' ||
    typeof document.description !== 'string'
  ) {
    throw new BackendRequestError('The legal document API returned an invalid response.', 502);
  }
  return document;
}

export async function fetchPublicFaqs(): Promise<PublicFaq[]> {
  const { body } = await requestBackend<PublicFaq[]>('manage/get-faq');
  if (!Array.isArray(body.data)) {
    throw new BackendRequestError('The FAQ API returned an invalid response.', 502);
  }
  return [...body.data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
