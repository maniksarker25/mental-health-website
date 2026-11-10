export interface PublicLegalDocument {
  _id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicFaq {
  _id: string;
  question: string;
  answer: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ManageWebResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
