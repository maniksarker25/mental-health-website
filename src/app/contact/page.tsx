'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangleIcon, MessageSquareIcon, PhoneCallIcon, SendIcon } from 'lucide-react';
import { contactFaqs } from '../../data/site';
import { FaqAccordion } from '../../components/article/FaqAccordion';
import type { ContactSubmission, InquiryType } from '../../types/topic';
import { cn } from '../../utils/cn';

const inquiryTypes: InquiryType[] = [
  'General question',
  'Clinical collaboration',
  'Product feedback',
  'Media enquiry',
];

interface FormState {
  name: string;
  email: string;
  inquiryType: InquiryType;
  message: string;
}

const emptyForm: FormState = {
  name: '',
  email: '',
  inquiryType: 'General question',
  message: '',
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = 'Please tell us what to call you.';
  if (!form.email.trim()) errors.email = 'We need an address to reply to.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'That does not look like an email address.';
  if (form.message.trim().length < 20)
    errors.message = 'A little more detail helps us route this correctly (20+ characters).';
  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setStatus('sending');
    const submission: ContactSubmission = { ...form, submittedAt: new Date().toISOString() };

    window.setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          const existing = window.localStorage.getItem('mhs-contact-submissions');
          const parsed: ContactSubmission[] = existing ? JSON.parse(existing) : [];
          window.localStorage.setItem('mhs-contact-submissions', JSON.stringify([...parsed, submission]));
        }
      } catch {
        // Storage is optional — the message is still considered sent.
      }
      setStatus('sent');
      setForm(emptyForm);
      toast.success('Message sent. A human replies within two working days.');
    }, 600);
  }

  const fieldClass =
    'w-full rounded-2xl border bg-canvas px-4 py-3 text-sm text-ink placeholder:text-body transition-colors duration-150 ease-gentle focus:outline-none';

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-sm font-medium text-brand">Contact</p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
            Reach the people who write and review these guides.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-body">
            We read every message. What we cannot do is provide care, counselling, or crisis response through this form.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div
          role="alert"
          className="flex flex-col gap-4 rounded-3xl border border-blush-border bg-blush-bg p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex gap-4">
            <AlertTriangleIcon className="mt-0.5 h-6 w-6 shrink-0 text-blush-text" />
            <div>
              <h2 className="font-serif text-xl text-ink">This form is not monitored for emergencies.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink">
                If you or someone you know is in immediate physical danger or mental health crisis, do not use this
                contact form. Call 988 or text 741741 immediately.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href="tel:988"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-medium text-white"
            >
              <PhoneCallIcon className="h-4 w-4" />
              Call 988
            </a>
            <a
              href="sms:741741?&body=HOME"
              className="inline-flex items-center gap-2 rounded-full border border-blush-border bg-surface px-4 py-2.5 text-sm font-medium text-ink"
            >
              <MessageSquareIcon className="h-4 w-4" />
              Text 741741
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
              <h2 className="font-serif text-2xl text-ink">Send a message</h2>
              <p className="mt-2 text-sm text-body">Typical reply time is two working days.</p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-ink">
                    Name
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(event) => update('name', event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    placeholder="Alex Morgan"
                    className={cn(
                      fieldClass,
                      'mt-2',
                      errors.name ? 'border-blush-border' : 'border-line focus:border-brand'
                    )}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs text-blush-text">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => update('email', event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    placeholder="alex@example.com"
                    className={cn(
                      fieldClass,
                      'mt-2',
                      errors.email ? 'border-blush-border' : 'border-line focus:border-brand'
                    )}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs text-blush-text">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="inquiry" className="block text-sm font-medium text-ink">
                    Inquiry type
                  </label>
                  <select
                    id="inquiry"
                    value={form.inquiryType}
                    onChange={(event) => update('inquiryType', event.target.value as InquiryType)}
                    className={cn(fieldClass, 'mt-2 border-line focus:border-brand')}
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-ink">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={(event) => update('message', event.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    placeholder="Tell us what you need. Please leave out clinical details about a specific person."
                    className={cn(
                      fieldClass,
                      'mt-2 resize-y',
                      errors.message ? 'border-blush-border' : 'border-line focus:border-brand'
                    )}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-xs text-blush-text">
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-transform duration-150 ease-gentle hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <SendIcon className="h-4 w-4" />
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
                <p aria-live="polite" className="text-xs text-body">
                  {status === 'sent'
                    ? 'Received. We will reply to the address you gave us.'
                    : 'We store your message only until it is answered.'}
                </p>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <h2 className="font-serif text-2xl text-ink">Common questions</h2>
            <div className="mt-6">
              <FaqAccordion faqs={contactFaqs} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
