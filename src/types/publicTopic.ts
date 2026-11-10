import type { Tone } from './topic';

export interface PublicTopic {
  _id: string;
  slug: string;
  name: string;
  shortDescription: string;
  tone: Tone;
  icon: string;
}

export interface PublicTopicListResponse {
  success: boolean;
  message?: string;
  data: PublicTopic[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
