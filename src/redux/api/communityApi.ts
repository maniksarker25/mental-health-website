import { baseApi } from './baseApi';
import type {
  ApiEnvelope,
  CommunityApiPost,
  CommunityApiReply,
  CommunityPostPage,
  CommunityRepliesPage,
} from '../../lib/community';

interface CommunityPageArgs {
  page: number;
  limit: number;
}

interface CreateCommunityPost {
  title: string;
  content: string;
  category: string;
  image?: string;
}

interface CreateCommunityReply {
  postId: string;
  content: string;
}

export const communityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommunityPosts: builder.query<CommunityPostPage, CommunityPageArgs>({
      query: ({ page, limit }) => `/community?page=${page}&limit=${limit}`,
      providesTags: (result) => [
        { type: 'CommunityPost', id: 'LIST' },
        ...(result?.data ?? []).map((post) => ({
          type: 'CommunityPost' as const,
          id: post._id,
        })),
      ],
    }),
    getCommunityReplies: builder.query<CommunityRepliesPage, CommunityPageArgs & { postId: string }>({
      query: ({ postId, page, limit }) =>
        `/community/${encodeURIComponent(postId)}/replies?page=${page}&limit=${limit}`,
      providesTags: (result, _error, { postId }) => [
        { type: 'CommunityReply', id: `POST-${postId}` },
        ...(result?.data ?? []).map((reply) => ({
          type: 'CommunityReply' as const,
          id: reply._id,
        })),
      ],
    }),
    createCommunityPost: builder.mutation<ApiEnvelope<CommunityApiPost>, CreateCommunityPost>({
      query: (body) => ({
        url: '/community',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'CommunityPost', id: 'LIST' }],
    }),

    
    toggleCommunityPostLike: builder.mutation<ApiEnvelope<CommunityApiPost>, string>({
      query: (postId) => ({
        url: `/community/${encodeURIComponent(postId)}/like`,
        method: 'POST',
      }),
    }),
    createCommunityReply: builder.mutation<
      ApiEnvelope<CommunityApiReply>,
      CreateCommunityReply
    >({
      query: ({ postId, content }) => ({
        url: `/community/${encodeURIComponent(postId)}/replies`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'CommunityReply', id: `POST-${postId}` },
      ],
    }),
  }),
});

export const {
  useGetCommunityPostsQuery,
  useLazyGetCommunityPostsQuery,
  useLazyGetCommunityRepliesQuery,
  useCreateCommunityPostMutation,
  useToggleCommunityPostLikeMutation,
  useCreateCommunityReplyMutation,
} = communityApi;
