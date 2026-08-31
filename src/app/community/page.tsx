'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  MessageSquarePlusIcon,
  SearchIcon,
  XIcon,
  HeartIcon,
  SendIcon,
  ImageIcon,
  ShieldCheckIcon,
  UsersIcon,
  HelpCircleIcon,
  PinIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react';
import {
  CommunityPost,
  CommunityReply,
  seedCommunityPosts,
} from '../../data/community';
import { CrisisBanner } from '../../components/CrisisBanner';
import { cn } from '../../utils/cn';

const anonymousAliases = [
  'Anonymous Willow',
  'Gentle Breeze',
  'Quiet Seeker',
  'Mindful Journey',
  'Hopeful Horizon',
  'Calm Waters',
  'Silent Oak',
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(seedCommunityPosts);
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal state
  const [showPostModal, setShowPostModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTag, setPostTag] = useState('Question');
  const [postAuthor, setPostAuthor] = useState(anonymousAliases[0]);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expanded replies state
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({
    'post-1': true,
    'post-2': true,
  });

  // New reply input per post
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Image zoom modal
  const [activeZoomImage, setActiveZoomImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mental_health_community_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading community posts from localStorage:', e);
    }
  }, []);

  // Save to localStorage when posts change
  const persistPosts = (updated: CommunityPost[]) => {
    setPosts(updated);
    try {
      localStorage.setItem('mental_health_community_posts', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving community posts to localStorage:', e);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
      toast.success('Image attached successfully.');
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) {
      toast.error('Please enter a question or title for your post.');
      return;
    }
    if (!postContent.trim()) {
      toast.error('Please share more details in your post description.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newPost: CommunityPost = {
        id: `post-${Date.now()}`,
        author: postAuthor,
        authorRole: 'Community Member',
        title: postTitle.trim(),
        content: postContent.trim(),
        category: 'Community Question',
        topicTag: postTag.trim() || 'Question',
        imageUrl: attachedImage || undefined,
        createdAt: 'Just now',
        likes: 1,
        replies: [],
      };

      const updated = [newPost, ...posts];
      persistPosts(updated);

      // Reset form
      setPostTitle('');
      setPostContent('');
      setPostTag('Question');
      setAttachedImage(null);
      setShowPostModal(false);
      setIsSubmitting(false);

      toast.success('Your question has been posted to the community!');
    }, 600);
  };

  const handleLikePost = (postId: string) => {
    const isLiked = likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: !isLiked }));

    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          likes: isLiked ? p.likes - 1 : p.likes + 1,
        };
      }
      return p;
    });
    persistPosts(updated);
  };

  const toggleReplies = (postId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddReply = (postId: string) => {
    const text = replyInputs[postId]?.trim();
    if (!text) {
      toast.error('Please type a supportive suggestion or reply before sending.');
      return;
    }

    const newReply: CommunityReply = {
      id: `reply-${Date.now()}`,
      author: postAuthor,
      content: text,
      createdAt: 'Just now',
      likes: 0,
    };

    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          replies: [...p.replies, newReply],
        };
      }
      return p;
    });

    persistPosts(updated);
    setReplyInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedReplies((prev) => ({ ...prev, [postId]: true }));
    toast.success('Your suggestion has been shared!');
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
    <div className="min-h-screen bg-canvas pb-20">
      {/* Header Banner */}
      <section className="border-b border-line bg-surface py-12 sm:py-16">
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

            <div>
              <button
                type="button"
                onClick={() => setShowPostModal(true)}
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
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
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
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
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
                        <span>{post.replies.length} Suggestions</span>
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

                      {post.replies.length > 0 ? (
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
                          placeholder="Write a supportive suggestion or answer…"
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
            })
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
            </div>
          )}
        </div>

        {/* Crisis Hotline Footer Banner */}
        <div className="mt-16">
          <CrisisBanner />
        </div>
      </main>

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
                    Share your experience or ask the community for suggestions.
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

                {/* Topic Tag */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                    Topic Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={postTag}
                    onChange={(e) => setPostTag(e.target.value)}
                    placeholder="e.g. Grounding, Sleep, Panic Attack, Coping Strategy"
                    className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-xs text-ink focus:border-brand focus:outline-none"
                  />
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

                {/* Image Upload Option */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                    Attach Image (Optional)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {attachedImage ? (
                    <div className="relative mt-2 overflow-hidden rounded-2xl border border-line bg-canvas p-2">
                      <img
                        src={attachedImage}
                        alt="Attached preview"
                        className="max-h-48 w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setAttachedImage(null)}
                        className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-canvas py-4 text-xs font-medium text-body hover:border-brand hover:text-ink"
                    >
                      <ImageIcon className="h-4 w-4 text-brand" />
                      <span>Click to attach a photo or visual screenshot (Max 5MB)</span>
                    </button>
                  )}
                </div>

                {/* Alias Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                    Display Alias (100% Anonymous)
                  </label>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {anonymousAliases.map((alias) => (
                      <button
                        key={alias}
                        type="button"
                        onClick={() => setPostAuthor(alias)}
                        className={cn(
                          'rounded-full border px-3 py-1 text-xs transition-colors',
                          postAuthor === alias
                            ? 'border-brand bg-brand text-white font-medium'
                            : 'border-line bg-canvas text-body hover:border-brand'
                        )}
                      >
                        {alias}
                      </button>
                    ))}
                  </div>
                </div>

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
