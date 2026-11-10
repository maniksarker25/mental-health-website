export interface PublicResourceTopic {
  _id: string;
  name: string;
  slug?: string;
  tone?: string;
  icon?: string;
  shortDescription?: string;
}

export interface PublicResource {
  _id: string;
  slug?: string;
  topic: PublicResourceTopic | string | null;
  title: string;
  shortDescription: string;
  contentHtml: string;
  readingTime: number;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicResourceListResponse {
  success: boolean;
  message?: string;
  data: PublicResource[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PublicResourceResponse {
  success: boolean;
  message?: string;
  data: PublicResource;
}

export function getPublicResourceTopic(resource: PublicResource): PublicResourceTopic | null {
  return typeof resource.topic === 'object' && resource.topic !== null
    ? resource.topic
    : null;
}

export function getPublicResourcePath(resource: PublicResource): string {
  return `/resources/${encodeURIComponent(resource.slug || resource._id)}`;
}
