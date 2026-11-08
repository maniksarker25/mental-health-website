'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeftIcon, ArrowRightIcon, HeartHandshakeIcon } from 'lucide-react';

type ResetStep = 'email' | 'code' | 'password';

async function submitResetRequest(path: string, payload: Record<string, string>) {
  const response = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(payload),
  });
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error('The server returned an invalid response.');
  }
  if (!response.ok) {
    const message =
      typeof body === 'object' &&
      body !== null &&
      'error' in body &&
      typeof body.error === 'string'
        ? body.error
        : 'The request could not be completed. Please try again.';
    throw new Error(message);
  }
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (step === 'email') {
        await submitResetRequest('forgot-password', { email: email.trim() });
        setStep('code');
        toast.success('A reset code has been sent to your email.');
      } else if (step === 'code') {
        await submitResetRequest('verify-reset-code', {
          email: email.trim(),
          resetCode: code,
        });
        setStep('password');
        toast.success('Code verified. Choose a new password.');
      } else {
        await submitResetRequest('reset-password', {
          email: email.trim(),
          password,
          confirmPassword,
        });
        toast.success('Your password has been reset. Please sign in.');
        router.push('/login');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to reset your password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setIsSubmitting(true);
    try {
      await submitResetRequest('forgot-password', { email: email.trim() });
      toast.success('A new reset code has been sent.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to resend the reset code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
            <HeartHandshakeIcon className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-ink sm:text-3xl">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-body">
            {step === 'email' && 'We will email you a code to verify your account.'}
            {step === 'code' && `Enter the six-digit code sent to ${email}.`}
            {step === 'password' && 'Choose a new password for your account.'}
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-line bg-surface p-6 shadow-xs sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 'email' && (
              <div>
                <label htmlFor="reset-email" className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Email address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
            )}

            {step === 'code' && (
              <div>
                <label htmlFor="reset-code" className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Verification code
                </label>
                <input
                  id="reset-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
                  className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-center text-lg tracking-[0.4em] text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
            )}

            {step === 'password' && (
              <>
                <div>
                  <label htmlFor="new-password" className="text-xs font-semibold uppercase tracking-wider text-ink">
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="text-xs font-semibold uppercase tracking-wider text-ink">
                    Confirm new password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSubmitting
                ? 'Please wait…'
                : step === 'email'
                  ? 'Send reset code'
                  : step === 'code'
                    ? 'Verify code'
                    : 'Reset password'}
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-xs">
            {step === 'code' ? (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isSubmitting}
                className="font-semibold text-brand hover:underline disabled:opacity-60"
              >
                Resend code
              </button>
            ) : <span />}
            <Link href="/login" className="inline-flex items-center gap-1 font-semibold text-brand hover:underline">
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
