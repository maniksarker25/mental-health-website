'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRightIcon, EyeOffIcon, ShieldCheckIcon, HeartHandshakeIcon, PlayIcon, SparklesIcon, UsersIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PackageCredit {
  purchaseId: string;
  packageTier: string;
}

const trustPills = [
  { label: 'Step-by-step setup', icon: ShieldCheckIcon },
  { label: 'Email or SMS delivery', icon: EyeOffIcon },
  { label: 'Clinically reviewed guides', icon: HeartHandshakeIcon },
];

export function HomeHero() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isCheckingCredit, setIsCheckingCredit] = React.useState(false);
  const [creditError, setCreditError] = React.useState('');

  const startMessageFlow = async () => {
    if (isAuthLoading || isCheckingCredit) return;
    setCreditError('');

    if (!isAuthenticated) {
      router.push('/packages');
      return;
    }

    setIsCheckingCredit(true);
    try {
      const response = await fetch('/api/package-purchase/credits', {
        credentials: 'same-origin',
        cache: 'no-store',
      });
      const result = await response.json() as {
        success?: boolean;
        message?: string;
        error?: string;
        data?: PackageCredit[];
      };
      if (!response.ok || result.success === false || !Array.isArray(result.data)) {
        throw new Error(result.error || result.message || 'Could not check your package credits.');
      }

      const credit = result.data[0];
      if (credit) {
        router.push(
          `/send-message?purchaseId=${encodeURIComponent(credit.purchaseId)}&tier=${encodeURIComponent(credit.packageTier)}`
        );
      } else {
        router.push('/packages');
      }
    } catch (error) {
      setCreditError(error instanceof Error ? error.message : 'Could not check your package credits.');
    } finally {
      setIsCheckingCredit(false);
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-line bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:py-24 lg:px-8">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand"
          >
            <UsersIcon className="h-3.5 w-3.5" />
            <span>Anonymous Mental Health Resource Dispatch</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.04, ease: [0.23, 1, 0.32, 1] }}
            className="mt-4 max-w-3xl font-serif text-4xl leading-[1.15] text-ink sm:text-5xl lg:text-6xl"
          >
            When starting the
            conversation feels
            heavy, send support
            first.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-body sm:text-lg"
          >
            Choose a one-time package, then send an anonymous email or SMS. Your identity is not included in the message.
          </motion.p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void startMessageFlow()}
              disabled={isAuthLoading || isCheckingCredit}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-transform duration-150 ease-gentle hover:scale-[1.02] active:scale-[0.98]"
            >
              {isCheckingCredit ? 'Checking package…' : 'Send a message'}
              <ArrowRightIcon className="h-4 w-4" />
            </button>

            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-5 py-3.5 text-sm font-medium text-ink transition-colors duration-150 ease-gentle hover:border-brand hover:bg-brand-tint"
            >
              Explore resources
            </Link>

            <a
              href="#how-it-works-video"
              className="inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-sm font-medium text-body transition-colors duration-150 ease-gentle hover:text-ink"
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
          {creditError && (
            <p role="alert" className="mt-3 max-w-xl rounded-xl border border-blush-border bg-blush-bg p-3 text-sm text-blush-text">
              {creditError}
            </p>
          )}

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
              alt="Gentle light shining through water"
              className="h-64 w-full rounded-3xl object-cover sm:h-80 lg:h-full shadow-md"
            />
            <figcaption className="absolute bottom-4 left-4 right-4 rounded-2xl border border-line bg-surface/95 p-4 backdrop-blur-md">
              <p className="font-serif text-base leading-snug text-ink sm:text-lg">
                “I noticed my friend was struggling with deep anxiety, but I didn’t know how to speak to him without making him defensive. I sent the anxiety toolkit anonymously, and it gave him a safe way to understand what he was feeling.”
              </p>
              <p className="mt-2 text-xs text-body">Anonymous supporter experience</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}