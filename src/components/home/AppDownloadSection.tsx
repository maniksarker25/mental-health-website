'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  SmartphoneIcon,
  ShieldCheckIcon,
  SendIcon,
  WindIcon,
  CloudIcon,
  FlameIcon,
  ShieldIcon,
  HeartIcon,
  BrainIcon,
  CheckIcon,
  ArrowUpRightIcon,
  Edit3Icon,
  SettingsIcon,
  HomeIcon,
  ClockIcon,
  ChevronLeftIcon,
  QrCodeIcon,
  StarIcon,
  CheckCircle2Icon,
  SparklesIcon
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface AppTopic {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'sky' | 'lavender' | 'sand' | 'blush' | 'mist';
  pillBg: string;
  pillText: string;
  iconBg: string;
}

const appTopics: AppTopic[] = [
  {
    id: 'anxiety',
    title: 'Anxiety',
    subtitle: 'Understanding worry, panic and th...',
    category: 'Anxiety',
    icon: WindIcon,
    tone: 'sky',
    pillBg: 'bg-[#e6f0f6] dark:bg-[#16262f]',
    pillText: 'text-[#1e4e68] dark:text-[#a8cee5]',
    iconBg: 'bg-[#d2e7f3] dark:bg-[#1f3747]'
  },
  {
    id: 'depression',
    title: 'Depression',
    subtitle: 'Low mood, energy and finding a fr...',
    category: 'Depression',
    icon: CloudIcon,
    tone: 'lavender',
    pillBg: 'bg-[#efebf8] dark:bg-[#211d2e]',
    pillText: 'text-[#45336b] dark:text-[#c9bde8]',
    iconBg: 'bg-[#e0d6f4] dark:bg-[#322a49]'
  },
  {
    id: 'stress-burnout',
    title: 'Stress & Burnout',
    subtitle: 'Recognising overload before it de...',
    category: 'Burnout',
    icon: FlameIcon,
    tone: 'sand',
    pillBg: 'bg-[#f7f2e8] dark:bg-[#262115]',
    pillText: 'text-[#5f4b23] dark:text-[#e0cba4]',
    iconBg: 'bg-[#ede1ca] dark:bg-[#3f3521]'
  },
  {
    id: 'substance-abuse',
    title: 'Substance Abuse',
    subtitle: 'Non-judgemental information and ...',
    category: 'Support',
    icon: ShieldIcon,
    tone: 'mist',
    pillBg: 'bg-[#ebf0ec] dark:bg-[#1a2420]',
    pillText: 'text-[#2e5e52] dark:text-[#93c4b2]',
    iconBg: 'bg-[#d7e4db] dark:bg-[#263b33]'
  },
  {
    id: 'grief-loss',
    title: 'Grief & Loss',
    subtitle: 'Living with loss, in its own time',
    category: 'Grief',
    icon: HeartIcon,
    tone: 'blush',
    pillBg: 'bg-[#f9eceb] dark:bg-[#2a1a19]',
    pillText: 'text-[#6f322e] dark:text-[#ecb6b1]',
    iconBg: 'bg-[#f2d4d2] dark:bg-[#452827]'
  },
  {
    id: 'dementia',
    title: 'Dementia',
    subtitle: 'For families, carers and early signs',
    category: 'Care',
    icon: BrainIcon,
    tone: 'mist',
    pillBg: 'bg-[#ebf0ec] dark:bg-[#1a2420]',
    pillText: 'text-[#2e5e52] dark:text-[#93c4b2]',
    iconBg: 'bg-[#d7e4db] dark:bg-[#263b33]'
  }
];

export function AppDownloadSection() {
  const [activeScreen, setActiveScreen] = useState<'topics' | 'review'>('topics');
  const [selectedTopic, setSelectedTopic] = useState<AppTopic>(appTopics[1]); // Default to Depression like in screenshot
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleSelectTopic = (topic: AppTopic) => {
    setSelectedTopic(topic);
    setActiveScreen('review');
    setSendSuccess(false);
  };

  const handleSendAnonymousMessage = () => {
    if (!disclaimerAccepted) {
      toast.error('Please accept the educational disclaimer to proceed.');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      toast.success(
        `Anonymous support link for "${selectedTopic.title}" dispatched successfully! Zero data recorded.`
      );
      setTimeout(() => {
        setSendSuccess(false);
      }, 4000);
    }, 900);
  };

  const handleStoreClick = (storeName: string) => {
    toast.info(`Opening ${storeName} download page...`);
  };

  return (
    <section
      id="download-app"
      aria-labelledby="download-heading"
      className="relative isolate overflow-hidden border-y border-line bg-surface py-16 sm:py-20 lg:py-24"
    >
      {/* Subtle Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-brand/5 blur-3xl dark:bg-brand/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-brand-tint/60 blur-3xl dark:bg-brand/10"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Information, Value Prop & Download Buttons */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand">
              <SmartphoneIcon className="h-3.5 w-3.5" />
              <span>Available for iOS & Android</span>
            </div>

            <h2
              id="download-heading"
              className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl"
            >
              Send anonymous support right from your phone.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-body sm:text-lg">
              When starting the conversation feels heavy, dispatch a clinically vetted resource directly
              by SMS or email. No sender identity attached, zero accounts required for the recipient,
              and nothing logged on our servers.
            </p>

            {/* Key feature points */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-line bg-canvas/70 p-4 transition-colors duration-150 hover:bg-canvas">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
                  <ShieldCheckIcon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-ink">100% Anonymous Delivery</h3>
                  <p className="mt-1 text-xs leading-relaxed text-body">
                    Your name, email, and phone number are never recorded or attached to the dispatch.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-line bg-canvas/70 p-4 transition-colors duration-150 hover:bg-canvas">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
                  <SparklesIcon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-ink">Clinically Vetted Guides</h3>
                  <p className="mt-1 text-xs leading-relaxed text-body">
                    Calm, shame-free educational guides written and reviewed by licensed clinicians.
                  </p>
                </div>
              </div>
            </div>

            {/* Store Download Buttons */}
            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink">
                Download the free app
              </p>
              <div className="mt-3.5 flex flex-wrap items-center gap-3.5">
                {/* Apple App Store */}
                <a
                  href="#download-app"
                  onClick={(e) => {
                    e.preventDefault();
                    handleStoreClick('App Store');
                  }}
                  className="group flex h-[52px] items-center gap-3 rounded-2xl bg-[#111815] px-5 text-white shadow-sm transition-all duration-150 ease-gentle hover:scale-[1.02] hover:bg-[#1a2521] active:scale-[0.98] dark:bg-[#eef2ee] dark:text-[#121816] dark:hover:bg-white"
                  aria-label="Download Mental Health Support App on the Apple App Store"
                >
                  <svg
                    className="h-6 w-6 fill-current transition-transform duration-150 group-hover:scale-105"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.14.64-2.81 1.43-.59.68-1.11 1.77-.97 2.82 1.08.08 2.18-.57 2.77-1.38z" />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] font-normal leading-none tracking-tight opacity-80">
                      Download on the
                    </span>
                    <span className="mt-0.5 block text-[15px] font-semibold leading-tight tracking-tight">
                      App Store
                    </span>
                  </div>
                </a>

                {/* Google Play Store */}
                <a
                  href="#download-app"
                  onClick={(e) => {
                    e.preventDefault();
                    handleStoreClick('Google Play');
                  }}
                  className="group flex h-[52px] items-center gap-3 rounded-2xl bg-[#111815] px-5 text-white shadow-sm transition-all duration-150 ease-gentle hover:scale-[1.02] hover:bg-[#1a2521] active:scale-[0.98] dark:bg-[#eef2ee] dark:text-[#121816] dark:hover:bg-white"
                  aria-label="Get Mental Health Support App on Google Play"
                >
                  <svg
                    className="h-6 w-6 fill-current transition-transform duration-150 group-hover:scale-105"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.956 1.956 0 0 1-.61-1.42V3.234c0-.54.22-1.047.61-1.42zm11.306 11.31l2.457 2.457-11.78 6.784 9.323-9.241zm0-2.248L5.592 1.635l11.774 6.78-2.451 2.461zm1.123 1.124l3.197-1.838a1.968 1.968 0 0 1 0 3.424l-3.197-1.586z" />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] font-normal leading-none tracking-tight opacity-80">
                      GET IT ON
                    </span>
                    <span className="mt-0.5 block text-[15px] font-semibold leading-tight tracking-tight">
                      Google Play
                    </span>
                  </div>
                </a>

                {/* QR Code trigger button */}
                <button
                  type="button"
                  onClick={() => setShowQrModal(!showQrModal)}
                  className="flex h-[52px] items-center gap-2 rounded-2xl border border-line bg-canvas px-4 text-xs font-medium text-ink transition-colors duration-150 ease-gentle hover:border-brand hover:bg-surface"
                  aria-label="Show QR Code for direct mobile download"
                >
                  <QrCodeIcon className="h-4 w-4 text-brand" />
                  <span>Scan QR Code</span>
                </button>
              </div>

              {/* QR Modal Popover */}
              <AnimatePresence>
                {showQrModal && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="mt-4 inline-flex items-center gap-4 rounded-3xl border border-line bg-canvas p-4 shadow-lg"
                  >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-line bg-white p-2 text-neutral-900">
                      <svg viewBox="0 0 100 100" className="h-full w-full fill-current">
                        <rect x="0" y="0" width="30" height="30" rx="4" />
                        <rect x="6" y="6" width="18" height="18" fill="white" rx="2" />
                        <rect x="10" y="10" width="10" height="10" rx="1" />

                        <rect x="70" y="0" width="30" height="30" rx="4" />
                        <rect x="76" y="6" width="18" height="18" fill="white" rx="2" />
                        <rect x="80" y="10" width="10" height="10" rx="1" />

                        <rect x="0" y="70" width="30" height="30" rx="4" />
                        <rect x="6" y="76" width="18" height="18" fill="white" rx="2" />
                        <rect x="10" y="80" width="10" height="10" rx="1" />

                        <rect x="40" y="10" width="8" height="8" />
                        <rect x="52" y="10" width="8" height="8" />
                        <rect x="40" y="24" width="8" height="8" />
                        <rect x="52" y="24" width="8" height="8" />

                        <rect x="10" y="44" width="8" height="8" />
                        <rect x="24" y="44" width="8" height="8" />
                        <rect x="40" y="44" width="20" height="8" />
                        <rect x="70" y="44" width="10" height="8" />
                        <rect x="88" y="44" width="8" height="8" />

                        <rect x="44" y="60" width="8" height="18" />
                        <rect x="60" y="60" width="12" height="8" />
                        <rect x="80" y="60" width="16" height="8" />
                        <rect x="60" y="76" width="8" height="18" />
                        <rect x="76" y="76" width="18" height="8" />
                        <rect x="84" y="88" width="10" height="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-ink">Point camera to install</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-body">
                        Direct download link for iOS & Android. Free, secure, and private.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowQrModal(false)}
                        className="mt-2 text-[11px] font-medium text-brand hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Rating / Endorsement Bar */}
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6 text-xs text-body">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <span className="font-medium text-ink">4.9 / 5.0 Rating</span>
              <span className="hidden sm:inline">·</span>
              <span>100% Free & Open Care Resources</span>
              <span className="hidden sm:inline">·</span>
              <span>No Ad Tracking</span>
            </div>
          </div>

          {/* Right Column: Interactive Realistic Smartphone Mockup */}
          <div className="relative flex justify-center lg:col-span-6 xl:col-span-5">
            {/* Screen Switcher Control Above Mockup */}
            <div className="absolute -top-11 flex items-center rounded-full border border-line bg-canvas p-1 text-xs shadow-sm">
              <button
                type="button"
                onClick={() => setActiveScreen('topics')}
                className={cn(
                  'rounded-full px-3.5 py-1 font-medium transition-all duration-150 ease-gentle',
                  activeScreen === 'topics'
                    ? 'bg-surface font-semibold text-ink shadow-sm'
                    : 'text-body hover:text-ink'
                )}
              >
                1. Topic Catalog
              </button>
              <button
                type="button"
                onClick={() => setActiveScreen('review')}
                className={cn(
                  'rounded-full px-3.5 py-1 font-medium transition-all duration-150 ease-gentle',
                  activeScreen === 'review'
                    ? 'bg-surface font-semibold text-ink shadow-sm'
                    : 'text-body hover:text-ink'
                )}
              >
                2. Review & Send
              </button>
            </div>

            {/* Realistic iPhone Frame */}
            <div className="relative w-full max-w-[340px] select-none rounded-[48px] border-[8px] border-[#18231f] bg-[#f9faf8] p-2.5 shadow-[0_25px_60px_-15px_rgba(24,35,31,0.35)] ring-1 ring-black/10 dark:border-[#2b3733] dark:bg-[#121816] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]">
              {/* Dynamic Island */}
              <div className="absolute left-1/2 top-4 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-[#18231f] dark:bg-[#2b3733]" />

              {/* Status Bar */}
              <div className="relative z-20 flex items-center justify-between px-4 pt-1 text-[11px] font-semibold text-[#18231f] dark:text-[#eef2ee]">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z" />
                  </svg>
                  <div className="h-2 w-4 rounded-sm border border-current p-0.5">
                    <div className="h-full w-full rounded-xs bg-current" />
                  </div>
                </div>
              </div>

              {/* Inner Screen Content Area */}
              <div className="relative mt-2 min-h-[580px] overflow-hidden rounded-[38px] bg-canvas text-ink transition-colors duration-200">
                <AnimatePresence mode="wait">
                  {/* SCREEN 1: TOPIC SELECTION (Matches Image 1) */}
                  {activeScreen === 'topics' && (
                    <motion.div
                      key="screen-topics"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                      className="flex h-full min-h-[580px] flex-col justify-between p-4"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#557569] dark:text-[#88b5a5]">
                            Anonymous
                          </span>
                          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface text-body">
                            <SettingsIcon className="h-3.5 w-3.5" />
                          </span>
                        </div>

                        <h3 className="mt-2 text-xl font-bold leading-tight tracking-tight text-ink">
                          How can we help today?
                        </h3>
                        <p className="mt-1 text-[11px] leading-relaxed text-body">
                          Pick a topic and we’ll send someone a private link to trusted educational resources.
                        </p>

                        {/* List Header */}
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs font-bold text-ink">Choose a topic</span>
                          <span className="text-[10px] text-body">8 resources</span>
                        </div>

                        {/* Topic List matching user screenshot */}
                        <div className="mt-2.5 space-y-2">
                          {appTopics.map((topic) => {
                            const TopicIcon = topic.icon;
                            const isSelected = selectedTopic.id === topic.id;
                            return (
                              <button
                                key={topic.id}
                                type="button"
                                onClick={() => handleSelectTopic(topic)}
                                className={cn(
                                  'group flex w-full items-center justify-between rounded-2xl border p-2.5 text-left transition-all duration-150',
                                  isSelected
                                    ? 'border-brand bg-surface shadow-xs'
                                    : 'border-line bg-surface/90 hover:border-brand/40 hover:bg-surface'
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={cn(
                                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                                      topic.iconBg
                                    )}
                                  >
                                    <TopicIcon className={cn('h-4 w-4', topic.pillText)} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-ink leading-snug">
                                      {topic.title}
                                    </p>
                                    <p className="truncate text-[10px] text-body">
                                      {topic.subtitle}
                                    </p>
                                  </div>
                                </div>
                                <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-brand opacity-60 transition-transform group-hover:scale-110 group-hover:opacity-100" />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom App Navigation Bar */}
                      <div className="mt-4 border-t border-line pt-2">
                        <div className="flex items-center justify-around text-center text-[10px]">
                          <div className="flex flex-col items-center gap-0.5 text-brand font-semibold">
                            <HomeIcon className="h-4 w-4" />
                            <span>Home</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5 text-body opacity-75">
                            <ClockIcon className="h-4 w-4" />
                            <span>History</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5 text-body opacity-75">
                            <SettingsIcon className="h-4 w-4" />
                            <span>Settings</span>
                          </div>
                        </div>
                        {/* iOS Home Indicator */}
                        <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-ink/20 dark:bg-ink/30" />
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN 2: REVIEW & DISPATCH (Matches Image 2) */}
                  {activeScreen === 'review' && (
                    <motion.div
                      key="screen-review"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                      className="flex h-full min-h-[580px] flex-col justify-between p-4"
                    >
                      <div>
                        {/* Top Step Header */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveScreen('topics')}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface text-body transition-colors hover:text-ink"
                            aria-label="Back to topic list"
                          >
                            <ChevronLeftIcon className="h-4 w-4" />
                          </button>
                          <div>
                            <h3 className="text-xs font-bold text-ink leading-tight">Review</h3>
                            <span className="text-[10px] text-body">Step 3 of 3</span>
                          </div>
                        </div>

                        {/* Step Progress Bar (3/3 filled) */}
                        <div className="mt-3 flex gap-1.5">
                          <div className="h-1 flex-1 rounded-full bg-brand" />
                          <div className="h-1 flex-1 rounded-full bg-brand" />
                          <div className="h-1 flex-1 rounded-full bg-brand" />
                        </div>

                        {/* Main Dispatch Review Card */}
                        <div className="mt-3 rounded-2xl border border-line bg-surface p-3.5 text-left shadow-xs">
                          {/* Field: TOPIC */}
                          <div className="border-b border-line/60 pb-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-body">
                                Topic
                              </span>
                              <button
                                type="button"
                                onClick={() => setActiveScreen('topics')}
                                className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-ink hover:border-brand"
                              >
                                <Edit3Icon className="h-2.5 w-2.5 text-body" />
                                Edit
                              </button>
                            </div>
                            <div className="mt-1.5 flex items-center gap-2">
                              <div
                                className={cn(
                                  'flex h-6 w-6 items-center justify-center rounded-lg',
                                  selectedTopic.iconBg
                                )}
                              >
                                <selectedTopic.icon className={cn('h-3.5 w-3.5', selectedTopic.pillText)} />
                              </div>
                              <span className="text-xs font-semibold text-ink">
                                {selectedTopic.title}
                              </span>
                            </div>
                          </div>

                          {/* Field: SEND VIA */}
                          <div className="border-b border-line/60 py-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-body">
                                Send Via
                              </span>
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-ink hover:border-brand"
                              >
                                <Edit3Icon className="h-2.5 w-2.5 text-body" />
                                Edit
                              </button>
                            </div>
                            <p className="mt-1 text-xs font-medium text-ink">Email</p>
                          </div>

                          {/* Field: RECIPIENT */}
                          <div className="border-b border-line/60 py-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-body">
                                Recipient
                              </span>
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-ink hover:border-brand"
                              >
                                <Edit3Icon className="h-2.5 w-2.5 text-body" />
                                Edit
                              </button>
                            </div>
                            <p className="mt-1 font-mono text-xs text-ink">m****@gmail.com</p>
                          </div>

                          {/* Field: MESSAGE */}
                          <div className="pt-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-body">
                                Message
                              </span>
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-ink hover:border-brand"
                              >
                                <Edit3Icon className="h-2.5 w-2.5 text-body" />
                                Edit
                              </button>
                            </div>
                            <p className="mt-1 text-[11px] italic leading-snug text-ink">
                              “Someone cares about you and wanted to share this.”
                            </p>
                          </div>
                        </div>

                        {/* Interactive Disclaimer Checkbox */}
                        <label className="mt-2.5 flex cursor-pointer items-start gap-2.5 rounded-2xl border border-line bg-surface p-2.5 text-left">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={disclaimerAccepted}
                            onClick={() => setDisclaimerAccepted(!disclaimerAccepted)}
                            className={cn(
                              'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-colors',
                              disclaimerAccepted
                                ? 'border-brand bg-brand text-white'
                                : 'border-line bg-canvas'
                            )}
                          >
                            {disclaimerAccepted && <CheckIcon className="h-3 w-3 stroke-[3]" />}
                          </button>
                          <span className="text-[10px] leading-tight text-body">
                            I understand this is an educational resource and not professional medical advice.
                          </span>
                        </label>

                        {/* Privacy & Zero-Retention Notice */}
                        <div className="mt-2 flex items-start gap-2 rounded-2xl border border-[#cfdbd2] bg-[#ebf0ec] p-2.5 text-left dark:border-[#33443c] dark:bg-[#1a2420]">
                          <ShieldCheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                          <p className="text-[10px] leading-tight text-brand-strong dark:text-[#93c4b2]">
                            Sent anonymously. Your name, email and number are never attached.
                          </p>
                        </div>
                      </div>

                      {/* Bottom Send Button */}
                      <div className="mt-3">
                        <button
                          type="button"
                          disabled={isSending || sendSuccess}
                          onClick={handleSendAnonymousMessage}
                          className={cn(
                            'w-full rounded-2xl py-3 text-xs font-semibold text-white shadow-sm transition-all duration-150 active:scale-[0.98]',
                            sendSuccess
                              ? 'bg-emerald-600'
                              : 'bg-[#2e5e52] hover:bg-[#24483f]'
                          )}
                        >
                          {isSending ? (
                            'Dispatching anonymously…'
                          ) : sendSuccess ? (
                            <span className="inline-flex items-center gap-1.5">
                              <CheckCircle2Icon className="h-3.5 w-3.5" />
                              Dispatched Anonymously!
                            </span>
                          ) : (
                            'Send anonymously'
                          )}
                        </button>

                        {/* iOS Home Indicator */}
                        <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-ink/20 dark:bg-ink/30" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
