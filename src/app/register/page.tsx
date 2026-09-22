'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  UserIcon,
  MailIcon,
  LockIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeOffIcon,
  HeartIcon,
  CheckCircle2Icon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/community';

  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!agreed) {
      toast.error('Please agree to the Community Guidelines & Terms.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(name.trim(), email.trim(), password);
      if (res.ok) {
        toast.success('Account created successfully! Welcome to Mention Mental Health.');
        router.push(redirectUrl);
      } else {
        toast.error(res.error || 'Failed to create account.');
      }
    } catch {
      toast.error('An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-sm mb-4">
          <HeartIcon className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-ink sm:text-3xl">
          Create Your Account
        </h1>
        <p className="mt-2 text-sm text-body leading-relaxed">
          Join our supportive community and unlock anonymous resource dispatch packages.
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-8 rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Full Name / Display Alias *
            </label>
            <div className="relative mt-1.5">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins or QuietOak"
                className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 pl-10 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
              />
              <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            </div>
            <p className="mt-1 text-[11px] text-subtle">
              Your name is shown when posting questions in the community board.
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Email Address *
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Password *
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Confirm Password *
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 pl-10 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
              />
              <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-line text-brand focus:ring-brand"
              />
              <span className="text-xs text-body leading-snug">
                I agree to the{' '}
                <Link href="/contact" className="text-brand font-medium hover:underline">
                  Community Rules
                </Link>{' '}
                and confirm I understand this service is educational and not for emergency crisis.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account…' : 'Create Account'}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-xs text-body">
          Already have an account?{' '}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="font-semibold text-brand hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* Safety & Privacy Footnote */}
      <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-subtle">
        <ShieldCheckIcon className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>100% confidential. Zero tracking on recipient delivery.</span>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={<div className="text-center text-sm text-subtle">Loading registration…</div>}>
        <RegisterFormContent />
      </Suspense>
    </div>
  );
}
