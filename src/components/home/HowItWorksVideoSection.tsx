'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  Volume2Icon,
  VolumeXIcon,
  ShieldCheckIcon,
  SendIcon,
  CheckCircle2Icon,
  BookOpenIcon,
  SparklesIcon,
} from 'lucide-react';

const videoScenes = [
  {
    step: '1. Select a Resource',
    title: 'Choose a clinically vetted guide',
    description:
      'Select a plain-language guide on anxiety, burnout, sleep, grief, or low mood. No jargon, no diagnosing.',
    icon: BookOpenIcon,
  },
  {
    step: '2. Dispatch Anonymously',
    title: 'Send via SMS or Email with zero tracking',
    description:
      'We strip your name, IP, and contact details completely. The recipient receives a quiet, private link.',
    icon: SendIcon,
  },
  {
    step: '3. Gentle Support Arrives',
    title: 'They open a calm, shame-free guide',
    description:
      'Featuring instant grounding tools, evidence-based coping strategies, and verified 24/7 crisis lines.',
    icon: CheckCircle2Icon,
  },
];

export function HowItWorksVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentScene((scene) => (scene + 1) % videoScenes.length);
            return 0;
          }
          return prev + 2.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentScene(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const ActiveIcon = videoScenes[currentScene].icon;

  return (
    <section
      id="how-it-works-video"
      aria-labelledby="video-heading"
      className="relative overflow-hidden border-b border-line bg-surface py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand">
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>How It Works</span>
          </div>
          <h2
            id="video-heading"
            className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl"
          >
            See how anonymous resource dispatch works.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-body">
            A 60-second visual demonstration showing how you can send quiet, clinically vetted mental health support
            without pressure or sender identity.
          </p>
        </div>

        {/* Streamlined Simple Video Player */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-line bg-[#131b18] shadow-2xl">
          <div className="relative flex min-h-[400px] flex-col justify-between p-6 text-white sm:min-h-[460px] sm:p-10">
            {/* Ambient Background Glows */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#0e1412] via-[#16241f] to-[#1f382f] opacity-95"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/25 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
            />

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-full bg-black/40 px-3.5 py-1.5 text-xs font-medium backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>How Anonymous Dispatch Works</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-neutral-300 transition-colors hover:bg-black/60 hover:text-white"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeXIcon className="h-4 w-4" /> : <Volume2Icon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Center Animated Stage */}
            <div className="relative z-10 my-auto py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene}
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -12 }}
                  transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                  className="mx-auto max-w-xl text-center"
                >
                  <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/30 text-emerald-300 ring-1 ring-emerald-400/30 backdrop-blur-md shadow-lg">
                    <ActiveIcon className="h-8 w-8" />
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-widest text-emerald-400">
                    {videoScenes[currentScene].step}
                  </p>

                  <h3 className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    {videoScenes[currentScene].title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-neutral-300 sm:text-base">
                    {videoScenes[currentScene].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 rounded-2xl bg-black/50 p-4 backdrop-blur-md ring-1 ring-white/10">
              {/* Progress Bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-emerald-400 transition-all duration-100 ease-linear"
                  style={{
                    width: `${((currentScene + progress / 100) / videoScenes.length) * 100}%`,
                  }}
                />
              </div>

              <div className="mt-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-neutral-950 shadow-md transition-transform duration-150 hover:scale-105 active:scale-95"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? (
                      <PauseIcon className="h-4 w-4 fill-current" />
                    ) : (
                      <PlayIcon className="h-4 w-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-neutral-300 transition-colors hover:bg-white/20 hover:text-white"
                    aria-label="Restart video"
                  >
                    <RotateCcwIcon className="h-3.5 w-3.5" />
                  </button>

                  <span className="text-xs font-medium text-neutral-300">
                    Step {currentScene + 1} of {videoScenes.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <ShieldCheckIcon className="h-4 w-4 text-emerald-400" />
                  <span>100% Confidential · Zero Data Retained</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
