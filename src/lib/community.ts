export interface CommunityApiAuthor {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  profile_image?: string;
  role?: string;
}

export interface CommunityApiPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  image?: string;
  likesCount?: number;
  repliesCount?: number;
  isPinned?: boolean;
  createdAt?: string;
  author?: CommunityApiAuthor | string;
}

export interface CommunityApiReply {
  _id: string;
  content: string;
  createdAt?: string;
  author?: CommunityApiAuthor | string;
}

export interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  meta?: {
    page?: number;
    total?: number;
    totalPages?: number;
  };
  message?: string;
  error?: string;
}

export interface CommunityPostPage extends ApiEnvelope<CommunityApiPost[]> {
  meta?: {
    page?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface CommunityRepliesPage extends ApiEnvelope<CommunityApiReply[]> {
  meta?: {
    page?: number;
    total?: number;
    totalPages?: number;
  };
}

export function getCommunityErrorMessage(error: unknown): string {
  if (typeof error !== 'object' || error === null) {
    return 'The community request failed.';
  }
  if ('data' in error && typeof error.data === 'object' && error.data !== null) {
    const data = error.data;
    if ('message' in data && typeof data.message === 'string') return data.message;
    if ('error' in data && typeof data.error === 'string') return data.error;
  }
  if ('error' in error && typeof error.error === 'string') return error.error;
  return 'The community request failed.';
}

export function getCommunityAuthorName(author: CommunityApiPost['author']): string {
  if (!author || typeof author === 'string') return 'Community Member';
  return (
    author.fullName?.trim() ||
    `${author.firstName || ''} ${author.lastName || ''}`.trim() ||
    'Community Member'
  );
}

export function formatCommunityDate(value?: string): string {
  if (!value) return 'Recently';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Recently'
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
