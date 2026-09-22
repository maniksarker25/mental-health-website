'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  LockIcon,
  MailIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeOffIcon,
  HeartHandshakeIcon,
  SparklesIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/community';

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.ok) {
        toast.success('Signed in successfully! Welcome back.');
        router.push(redirectUrl);
      } else {
        toast.error(res.error || 'Failed to sign in. Please try again.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('sarah.walker@example.com');
    setPassword('Compassion2026!');
    setIsSubmitting(true);
    const res = await login('sarah.walker@example.com', 'Compassion2026!');
    setIsSubmitting(false);
    if (res.ok) {
      toast.success('Signed in with quick demo account!');
      router.push(redirectUrl);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-sm mb-4">
          <HeartHandshakeIcon className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-ink sm:text-3xl">
          Sign In to Your Account
        </h1>
        <p className="mt-2 text-sm text-body leading-relaxed">
          Access the community discussion board and purchase anonymous support packages.
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-8 rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Email Address
            </label>
            <div className="relative mt-1.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 pl-10 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
              />
              <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                Password
              </label>
              <button
                type="button"
                onClick={() =>
                  toast.info('Password reset instructions will be sent to your email.')
                }
                className="text-xs font-medium text-brand hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 pl-10 pr-10 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
              />
              <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle hover:text-ink"
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
              />
              <span className="text-xs text-body">Keep me signed in</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-2 text-subtle">Or continue with</span>
          </div>
        </div>

        {/* Quick Demo Login */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-canvas py-2.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
        >
          <SparklesIcon className="h-3.5 w-3.5 text-brand" />
          One-Click Demo Sign In
        </button>

        {/* Register Link */}
        <p className="mt-6 text-center text-xs text-body">
          Don&apos;t have an account yet?{' '}
          <Link
            href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
            className="font-semibold text-brand hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* Safety & Privacy Footnote */}
      <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-subtle">
        <ShieldCheckIcon className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>100% confidential. Recipient data is never linked to sender accounts.</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={<div className="text-center text-sm text-subtle">Loading sign-in…</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
