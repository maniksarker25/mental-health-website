'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  MessageSquarePlusIcon,
  SearchIcon,
  XIcon,
  HeartIcon,
  SendIcon,
  ShieldCheckIcon,
  UsersIcon,
  HelpCircleIcon,
  PinIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LogInIcon,
} from 'lucide-react';
import {
  CommunityPost,
  CommunityReply,
  communityCategories,
} from '../../data/community';
import { CrisisBanner } from '../../components/CrisisBanner';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';
import {
  CommunityApiPost,
  CommunityApiReply,
  formatCommunityDate,
  getCommunityErrorMessage,
  getCommunityAuthorName,
} from '../../lib/community';
import {
  useCreateCommunityPostMutation,
  useCreateCommunityReplyMutation,
  useGetCommunityPostsQuery,
  useLazyGetCommunityPostsQuery,
  useLazyGetCommunityRepliesQuery,
  useToggleCommunityPostLikeMutation,
} from '../../redux/api/communityApi';

function mapCommunityPost(post: CommunityApiPost): CommunityPost {
  return {
    id: post._id,
    author: getCommunityAuthorName(post.author),
    authorRole: 'Community Member',
    title: post.title,
    content: post.content,
    category: post.category,
    topicTag: post.category,
    imageUrl: post.image || undefined,
    createdAt: formatCommunityDate(post.createdAt),
    likes: post.likesCount ?? 0,
    replyCount: post.repliesCount ?? 0,
    replies: [],
    isPinned: post.isPinned,
  };
}

function mapCommunityReply(reply: CommunityApiReply): CommunityReply {
  return {
    id: reply._id,
    author: getCommunityAuthorName(reply.author),
    content: reply.content,
    createdAt: formatCommunityDate(reply.createdAt),
    likes: 0,
  };
}

export default function CommunityPage() {
  const { user, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [postPage, setPostPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const firstPageQuery = useGetCommunityPostsQuery({ page: 1, limit: 100 });
  const [fetchPostsPage, { isFetching: isLoadingMorePosts }] = useLazyGetCommunityPostsQuery();
  const [fetchReplies] = useLazyGetCommunityRepliesQuery();
  const [createPost] = useCreateCommunityPostMutation();
  const [toggleLike] = useToggleCommunityPostLikeMutation();
  const [createReply] = useCreateCommunityReplyMutation();

  // Form modal state
  const [showPostModal, setShowPostModal] = useState(false);
  const [showLoginPromptModal, setShowLoginPromptModal] = useState(false);
  const [loginPromptReason, setLoginPromptReason] = useState('post a question');

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('General Discussion');
  const [postImage, setPostImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expanded replies state
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [loadedReplies, setLoadedReplies] = useState<Record<string, boolean>>({});

  // New reply input per post
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Image zoom modal
  const [activeZoomImage, setActiveZoomImage] = useState<string | null>(null);

  useEffect(() => {
    const result = firstPageQuery.data;
    if (!Array.isArray(result?.data)) return;
    setPosts(result.data.map(mapCommunityPost));
    setPostPage(1);
    setHasMorePosts((result.meta?.totalPages ?? 1) > 1);
  }, [firstPageQuery.data]);

  const loadNextPostsPage = async () => {
    const nextPage = postPage + 1;
    try {
      const result = await fetchPostsPage({ page: nextPage, limit: 100 }).unwrap();
      if (!Array.isArray(result.data)) throw new Error('The community feed response was invalid.');
      setPosts((current) => [...current, ...result.data!.map(mapCommunityPost)]);
      setPostPage(nextPage);
      setHasMorePosts((result.meta?.totalPages ?? nextPage) > nextPage);
    } catch (error) {
      toast.error(getCommunityErrorMessage(error));
    }
  };

  const handleOpenPostModal = () => {
    if (!isAuthenticated) {
      setLoginPromptReason('ask a question or publish a post');
      setShowLoginPromptModal(true);
      return;
    }
    setShowPostModal(true);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setLoginPromptReason('post a question');
      setShowLoginPromptModal(true);
      return;
    }

    if (!postTitle.trim()) {
      toast.error('Please enter a question or title for your post.');
      return;
    }
    if (!postContent.trim()) {
      toast.error('Please share more details in your post description.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost({
        title: postTitle.trim(),
        content: postContent.trim(),
        category: postCategory,
        ...(postImage.trim() ? { image: postImage.trim() } : {}),
      }).unwrap();
      setPostTitle('');
      setPostContent('');
      setPostCategory('General Discussion');
      setPostImage('');
      setShowPostModal(false);
      toast.success('Your post was submitted and is waiting for moderator review.');
    } catch (error) {
      toast.error(getCommunityErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!isAuthenticated) {
      setLoginPromptReason('mark a post as helpful');
      setShowLoginPromptModal(true);
      return;
    }
    const previousPost = posts.find((post) => post.id === postId);
    if (!previousPost) return;
    try {
      const result = await toggleLike(postId).unwrap();
      if (!result.data) throw new Error('The server did not return the updated post.');
      const updatedPost = mapCommunityPost(result.data);
      setPosts((current) =>
        current.map((post) => (post.id === postId ? { ...post, likes: updatedPost.likes } : post))
      );
      if (updatedPost.likes !== previousPost.likes) {
        setLikedPosts((current) => ({ ...current, [postId]: updatedPost.likes > previousPost.likes }));
      }
    } catch (error) {
      toast.error(getCommunityErrorMessage(error));
    }
  };

  const toggleReplies = async (postId: string) => {
    const shouldExpand = !expandedReplies[postId];
    setExpandedReplies((previous) => ({ ...previous, [postId]: shouldExpand }));
    if (!shouldExpand || loadedReplies[postId]) return;

    try {
      const result = await fetchReplies({ postId, page: 1, limit: 100 }).unwrap();
      if (!Array.isArray(result.data)) throw new Error('The community replies response was invalid.');
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? {
                ...post,
                replies: result.data!.map(mapCommunityReply),
                replyCount: result.meta?.total ?? result.data!.length,
              }
            : post
        )
      );
      setLoadedReplies((previous) => ({ ...previous, [postId]: true }));
    } catch (error) {
      setExpandedReplies((previous) => ({ ...previous, [postId]: false }));
      toast.error(getCommunityErrorMessage(error));
    }
  };

  const handleAddReply = async (postId: string) => {
    if (!isAuthenticated) {
      setLoginPromptReason('share a suggestion or reply');
      setShowLoginPromptModal(true);
      return;
    }

    const text = replyInputs[postId]?.trim();
    if (!text) {
      toast.error('Please type a supportive suggestion or reply before sending.');
      return;
    }

    try {
      const result = await createReply({ postId, content: text }).unwrap();
      if (!result.data) throw new Error('The server did not return the new reply.');
      const newReply = mapCommunityReply(result.data);
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? {
                ...post,
                replies: [...post.replies, newReply],
                replyCount: (post.replyCount ?? post.replies.length) + 1,
              }
            : post
        )
      );
      setLoadedReplies((previous) => ({ ...previous, [postId]: true }));
      setReplyInputs((previous) => ({ ...previous, [postId]: '' }));
      setExpandedReplies((previous) => ({ ...previous, [postId]: true }));
      toast.success('Your suggestion has been shared!');
    } catch (error) {
      toast.error(getCommunityErrorMessage(error));
    }
  };

  // Search filter strictly across posts
  const filteredPosts = posts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.topicTag.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen  pb-20">
      {/* Header Banner */}
      <section className="border-b border-line bg-canvas py-12 sm:py-16 ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand">
                <UsersIcon className="h-3.5 w-3.5" />
                <span>Support & Peer Suggestions</span>
              </div>
              <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
                Community Space
              </h1>
              <p className="mt-3 text-base leading-relaxed text-body">
                A safe, friendly forum to ask questions, share everyday experiences, post images, and receive
                supportive suggestions from peers and clinical advocates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                type="button"
                onClick={handleOpenPostModal}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageSquarePlusIcon className="h-4 w-4" />
                <span>Ask a Question or Post</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-body" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search community posts, questions, or keywords…"
                className="w-full rounded-full border border-line bg-canvas py-3 pl-11 pr-10 text-xs sm:text-sm text-ink placeholder:text-body focus:border-brand focus:outline-none shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-body hover:text-ink"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Post Feed Area */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Community Guidelines Notice */}
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-xs text-body">
          <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p className="leading-relaxed">
            <span className="font-semibold text-ink">Community Safety:</span> Be kind, compassionate, and
            respectful. Suggestions are peer experiences and not clinical prescriptions.
          </p>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {firstPageQuery.isLoading ? (
            <div className="rounded-3xl border border-line bg-surface p-12 text-center text-sm text-body">
              Loading community discussions…
            </div>
          ) : firstPageQuery.error ? (
            <div className="rounded-3xl border border-line bg-surface p-12 text-center">
              <p className="text-sm text-body">
                {getCommunityErrorMessage(firstPageQuery.error)}
              </p>
              <button
                type="button"
                onClick={() => void firstPageQuery.refetch()}
                className="mt-4 rounded-full bg-brand px-5 py-2 text-xs font-medium text-white"
              >
                Try again
              </button>
            </div>
          ) : filteredPosts.length > 0 ? (
            <>
            {filteredPosts.map((post) => {
              const isExpanded = expandedReplies[post.id];
              const isLiked = likedPosts[post.id];

              return (
                <article
                  key={post.id}
                  className="rounded-3xl border border-line bg-surface p-6 shadow-xs sm:p-8"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-tint font-serif font-bold text-brand">
                        {post.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-ink">{post.author}</span>
                        <p className="text-[11px] text-body">{post.createdAt}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-line bg-canvas px-3 py-1 text-[11px] font-medium text-body">
                        {post.topicTag}
                      </span>
                      {post.isPinned && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                          <PinIcon className="h-3 w-3" />
                          Pinned
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Content */}
                  <h2 className="mt-4 font-serif text-xl font-bold leading-snug text-ink sm:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-body whitespace-pre-line sm:text-base">
                    {post.content}
                  </p>

                  {/* Attached Image (if present) */}
                  {post.imageUrl && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-canvas">
                      <button
                        type="button"
                        onClick={() => setActiveZoomImage(post.imageUrl || null)}
                        className="group relative block w-full text-left"
                      >
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="max-h-96 w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                          <EyeIcon className="h-3 w-3" />
                          <span>View Full Image</span>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                    <div className="flex items-center gap-3">
                      {/* Like / Helpful button */}
                      <button
                        type="button"
                        onClick={() => handleLikePost(post.id)}
                        className={cn(
                          'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
                          isLiked
                            ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400'
                            : 'border-line bg-canvas text-body hover:border-brand hover:text-ink'
                        )}
                      >
                        <HeartIcon
                          className={cn('h-3.5 w-3.5', isLiked ? 'fill-current text-rose-500' : '')}
                        />
                        <span>{post.likes} Helpful</span>
                      </button>

                      {/* Toggle suggestions */}
                      <button
                        type="button"
                        onClick={() => toggleReplies(post.id)}
                        className="flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-body transition-colors hover:border-brand hover:text-ink"
                      >
                        <span>{post.replyCount ?? post.replies.length} Suggestions</span>
                        {isExpanded ? (
                          <ChevronUpIcon className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDownIcon className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Suggestions / Reply Thread */}
                  {isExpanded && (
                    <div className="mt-6 space-y-4 border-t border-line/60 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink">
                        Community Suggestions & Answers
                      </p>

                      {!loadedReplies[post.id] ? (
                        <p className="text-xs text-body">Loading suggestions…</p>
                      ) : post.replies.length > 0 ? (
                        <div className="space-y-3">
                          {post.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="rounded-2xl border border-line bg-canvas/80 p-4 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-ink">{reply.author}</span>
                                <span className="text-[10px] text-body">{reply.createdAt}</span>
                              </div>
                              <p className="mt-2 leading-relaxed text-body">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-body italic">
                          No suggestions yet. Be the first to share a warm, helpful thought below!
                        </p>
                      )}

                      {/* Add suggestion input */}
                      <div className="mt-4 flex items-center gap-2">
                        <input
                          type="text"
                          value={replyInputs[post.id] || ''}
                          onChange={(e) =>
                            setReplyInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddReply(post.id);
                          }}
                          placeholder={
                            isAuthenticated
                              ? 'Write a supportive suggestion or answer…'
                              : 'Sign in to write a suggestion or answer…'
                          }
                          className="flex-1 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-ink placeholder:text-body focus:border-brand focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddReply(post.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white transition-transform hover:scale-105 active:scale-95"
                          aria-label="Submit suggestion"
                        >
                          <SendIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
            {hasMorePosts && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  disabled={isLoadingMorePosts}
                  onClick={() => void loadNextPostsPage()}
                  className="rounded-full border border-line bg-surface px-6 py-2.5 text-xs font-semibold text-ink hover:border-brand disabled:opacity-60"
                >
                  {isLoadingMorePosts ? 'Loading more…' : 'Load more discussions'}
                </button>
              </div>
            )}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-line bg-surface p-12 text-center">
              <HelpCircleIcon className="mx-auto h-10 w-10 text-body/60" />
              <h2 className="mt-3 font-serif text-2xl font-bold text-ink">
                No discussions found matching “{searchQuery}”.
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-body">
                Try searching with different keywords or ask your own question to start a new discussion.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-5 inline-flex items-center rounded-full bg-brand px-5 py-2 text-xs font-medium text-white"
              >
                Clear search
              </button>
              {hasMorePosts && (
                <button
                  type="button"
                  disabled={isLoadingMorePosts}
                  onClick={() => void loadNextPostsPage()}
                  className="ml-3 mt-5 inline-flex items-center rounded-full border border-line px-5 py-2 text-xs font-medium text-ink disabled:opacity-60"
                >
                  {isLoadingMorePosts ? 'Loading…' : 'Load more discussions'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Crisis Hotline Footer Banner */}
        <div className="mt-16">
          <CrisisBanner />
        </div>
      </main>

      {/* Login Prompt Modal (When user tries to post/reply without sign in) */}
      <AnimatePresence>
        {showLoginPromptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-2xl text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white mb-4">
                <LogInIcon className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">Sign In Required</h2>
              <p className="mt-2 text-xs text-body leading-relaxed">
                Please sign in or create an account to {loginPromptReason}. This ensures our community remains a safe, respectful environment.
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <Link
                  href={`/login?redirect=${encodeURIComponent('/community')}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-xs font-semibold text-white shadow-xs hover:bg-brand-strong"
                >
                  <LogInIcon className="h-4 w-4" />
                  Sign In to Continue
                </Link>
                <Link
                  href={`/register?redirect=${encodeURIComponent('/community')}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-canvas py-3 text-xs font-semibold text-ink hover:border-brand"
                >
                  Create an Account
                </Link>
                <button
                  type="button"
                  onClick={() => setShowLoginPromptModal(false)}
                  className="mt-1 text-xs text-subtle hover:text-ink"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-ink">Ask a Question or Post</h2>
                  <p className="text-xs text-body mt-0.5">
                    Share your experience or ask the community for suggestions as{' '}
                    <strong className="text-ink font-semibold">{user?.name || 'Community Member'}</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-body hover:text-ink"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreatePost} className="mt-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                    Question / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g., How do you navigate intense panic attacks in crowded places?"
                    className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-body/60 focus:border-brand focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                    Category
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-xs text-ink focus:border-brand focus:outline-none"
                  >
                    {communityCategories
                      .filter((category) => category !== 'All Discussions')
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                    Post Details & Context *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Describe what you are experiencing, what you've tried so far, or what specific suggestions you're hoping for…"
                    className="mt-1.5 w-full rounded-xl border border-line bg-canvas p-4 text-sm text-ink placeholder:text-body/60 focus:border-brand focus:outline-none"
                  />
                </div>

                {/* Optional image URL */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={postImage}
                    onChange={(e) => setPostImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-xs text-ink focus:border-brand focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-subtle">
                    Add a publicly accessible image URL. Direct file uploads are not supported by the community API.
                  </p>
                  {postImage.trim() && (
                    <div className="relative mt-2 overflow-hidden rounded-2xl border border-line bg-canvas p-2">
                      <img
                        src={postImage}
                        alt="Post image preview"
                        className="max-h-48 w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setPostImage('')}
                        className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-xs text-subtle">
                  Your account profile name will be shown as the post author.
                </p>

                {/* Submit Action */}
                <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="rounded-full px-5 py-2.5 text-xs font-medium text-body hover:text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-brand px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] disabled:opacity-60"
                  >
                    {isSubmitting ? 'Posting…' : 'Publish Question'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Zoom Lightbox Modal */}
      <AnimatePresence>
        {activeZoomImage && (
          <div
            onClick={() => setActiveZoomImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh]"
            >
              <img
                src={activeZoomImage}
                alt="Enlarged view"
                className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl"
              />
              <button
                type="button"
                onClick={() => setActiveZoomImage(null)}
                className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md hover:bg-neutral-200"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
