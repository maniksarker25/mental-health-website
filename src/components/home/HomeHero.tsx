'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon, EyeOffIcon, ShieldCheckIcon, StethoscopeIcon } from 'lucide-react';

const trustPills = [
  { label: '100% Confidential', icon: ShieldCheckIcon },
  { label: 'Zero Data Retained', icon: EyeOffIcon },
  { label: 'Clinically Vetted', icon: StethoscopeIcon },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:py-24 lg:px-8">
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="text-sm font-medium text-brand"
          >
            Anonymous resource dispatch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.04, ease: [0.23, 1, 0.32, 1] }}
            className="mt-4 max-w-3xl font-serif text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl"
          >
            When starting the conversation feels impossible, send support first.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-body sm:text-lg"
          >
            Choose a clinically reviewed guide and dispatch it anonymously by text or email. No sender name, no account
            for the person receiving it, and nothing stored on our side — just a calm, shame-free explanation waiting
            whenever they are ready to open it.
          </motion.p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-transform duration-150 ease-gentle hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore support guides
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-ink transition-colors duration-150 ease-gentle hover:bg-brand-tint"
            >
              How it works
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
              alt="A glass of water on a wooden dresser in soft morning light"
              className="h-64 w-full rounded-3xl object-cover sm:h-80 lg:h-full"
            />
            <figcaption className="absolute bottom-4 left-4 right-4 rounded-2xl border border-line bg-surface p-4">
              <p className="font-serif text-lg leading-snug text-ink">
                “I could not say it to her face. I sent the guide, and three days later she brought it up herself.”
              </p>
              <p className="mt-2 text-xs text-body">Anonymous — the only kind of feedback we can receive</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}