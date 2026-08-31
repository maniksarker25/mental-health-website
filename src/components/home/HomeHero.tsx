'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon, EyeOffIcon, ShieldCheckIcon, StethoscopeIcon, PlayIcon, SparklesIcon } from 'lucide-react';

const trustPills = [
  { label: '100% Confidential', icon: ShieldCheckIcon },
  { label: 'Zero Data Retained', icon: EyeOffIcon },
  { label: 'Clinically Vetted', icon: StethoscopeIcon },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:py-24 lg:px-8">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand"
          >
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>Anonymous Mental Health Resource Dispatch</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.04, ease: [0.23, 1, 0.32, 1] }}
            className="mt-4 max-w-3xl font-serif text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl"
          >
            When starting the conversation feels heavy, send support first.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-body sm:text-lg"
          >
            Choose a clinically reviewed guide and dispatch it anonymously by text or email. No sender name, zero accounts
            for the recipient, and nothing stored on our servers — just a calm, shame-free explanation waiting whenever they
            are ready.
          </motion.p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-transform duration-150 ease-gentle hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore resources
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            <a
              href="#how-it-works-video"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-5 py-3.5 text-sm font-medium text-ink transition-colors duration-150 ease-gentle hover:border-brand hover:bg-brand-tint"
            >
              <PlayIcon className="h-4 w-4 text-brand fill-current" />
              How it works video
            </a>

            <a
              href="#packages-section"
              className="inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-sm font-medium text-body transition-colors duration-150 ease-gentle hover:text-ink"
            >
              View packages
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-2.5">
            {trustPills.map((pill, index) => (
              <motion.li
                key={pill.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.26, delay: 0.14 + index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-2 text-xs font-medium text-body"
              >
                <pill.icon className="h-3.5 w-3.5 text-brand" />
                {pill.label}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <figure className="relative h-full">
            <img
              src="/6f1a0d9f-8579-46cc-ac9d-c99dc170b4df.jpg"
              alt="Calm morning light reflecting through water"
              className="h-64 w-full rounded-3xl object-cover sm:h-80 lg:h-full shadow-md"
            />
            <figcaption className="absolute bottom-4 left-4 right-4 rounded-2xl border border-line bg-surface/95 p-4 backdrop-blur-md">
              <p className="font-serif text-base leading-snug text-ink sm:text-lg">
                “I couldn’t find the right words to say out loud. I sent the anxiety guide, and three days later she brought it up herself.”
              </p>
              <p className="mt-2 text-xs text-body">Anonymous supporter feedback</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}