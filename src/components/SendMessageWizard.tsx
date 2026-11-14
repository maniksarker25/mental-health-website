'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  HeartHandshakeIcon,
  MailIcon,
  MessageSquareTextIcon,
  ShieldAlertIcon,
} from 'lucide-react';
import type { PublicTopic } from '../types/publicTopic';
import { getPublicResourceTopic, type PublicResource } from '../types/resource';
import { topicIcons, toneStyles } from '../utils/tone';
import { cn } from '../utils/cn';
import { useAuth } from '../contexts/AuthContext';

type DeliveryMethod = 'email' | 'sms';

interface RecipientDetails {
  name: string;
  email: string;
  phone: string;
  note: string;
}

const stepLabels = ['Topic', 'Resources', 'Recipient', 'Review'];

const fieldClassName =
  'mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-body/60 focus:border-brand';

function normalizeTopic(value: string | undefined): string {
  return value?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? '';
}

function maskDestination(method: DeliveryMethod, recipient: RecipientDetails): string {
  if (method === 'email') {
    const [local = '', domain = ''] = recipient.email.split('@');
    return `${local.slice(0, 1)}***@${domain}`;
  }
  return `••• ••• ${recipient.phone.slice(-4)}`;
}

export function SendMessageWizard({
  initialTopicId,
  packagePurchaseId,
  packageTier,
  topics,
  topicsUnavailable,
  resources,
  resourcesUnavailable,
}: {
  initialTopicId?: string;
  packagePurchaseId?: string;
  packageTier?: string;
  topics: PublicTopic[];
  topicsUnavailable: boolean;
  resources: PublicResource[];
  resourcesUnavailable: boolean;
}) {
  const [step, setStep] = useState(0);
  const [selectedTopicId, setSelectedTopicId] = useState(
    topics.find((item) => item.slug === initialTopicId || item._id === initialTopicId)?.slug ?? ''
  );
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('email');
  const [recipient, setRecipient] = useState<RecipientDetails>({
    name: '',
    email: '',
    phone: '',
    note: '',
  });
  const [confirmsSending, setConfirmsSending] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const idempotencyKeyRef = useRef<string | undefined>(undefined);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const selectedTopic = topics.find((topic) => topic.slug === selectedTopicId);
  const matchingResources = selectedTopic
    ? resources.filter((resource) => {
        const resourceTopic = getPublicResourceTopic(resource);
        const topicTerms = [selectedTopic._id, selectedTopic.slug, selectedTopic.name]
          .map(normalizeTopic)
          .filter(Boolean);
        const resourceTerms = [resourceTopic?.slug, resourceTopic?.name]
          .map(normalizeTopic)
          .filter(Boolean);
        return topicTerms.some((term) => resourceTerms.includes(term));
      })
    : [];
  const availableResources = matchingResources.length > 0 ? matchingResources : resources;
  const selectedResources = resources.filter((resource) => selectedResourceIds.includes(resource._id));

  const updateRecipient = (field: keyof RecipientDetails, value: string) => {
    setRecipient((current) => ({ ...current, [field]: value }));
  };

  if (completed) {
    return (
      <section className="bg-canvas px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-surface p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-tint text-brand">
            <CheckCircle2Icon className="h-7 w-7" />
          </div>
          <h1 className="mt-5 font-serif text-3xl text-ink">Message accepted for delivery</h1>
          <p className="mt-3 text-sm leading-relaxed text-body">
            The delivery provider accepted the message. Final delivery depends on the email provider or mobile carrier.
          </p>
          <a
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
          >
            Return to home
          </a>
        </div>
      </section>
    );
  }

  if (isAuthLoading) {
    return (
      <section className="bg-canvas px-4 py-16 sm:px-6 lg:px-8" aria-busy="true">
        <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-surface p-8 text-center text-sm text-body">
          Checking your sign-in…
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    const redirectPath = `/send-message${packagePurchaseId ? `?purchaseId=${encodeURIComponent(packagePurchaseId)}&tier=${encodeURIComponent(packageTier ?? '')}` : ''}`;
    return (
      <section className="bg-canvas px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-surface p-8 text-center shadow-sm sm:p-12">
          <h1 className="font-serif text-3xl text-ink">Sign in to send a message</h1>
          <p className="mt-3 text-sm leading-relaxed text-body">
            A confirmed package credit and an account are required. Sign in before entering recipient details.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectPath)}`}
              className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-brand"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!packagePurchaseId) {
    return (
      <section className="bg-canvas px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-surface p-8 text-center shadow-sm sm:p-12">
          <h1 className="font-serif text-3xl text-ink">A package credit is required</h1>
          <p className="mt-3 text-sm leading-relaxed text-body">
            Choose a one-time package first. Once Stripe confirms payment, you can use its one message credit here.
          </p>
          <Link href="/packages" className="mt-7 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-medium text-white hover:bg-brand-strong">
            View packages
          </Link>
        </div>
      </section>
    );
  }

  const continueFromRecipient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep(3);
  };

  const toggleResource = (resourceId: string) => {
    setSelectedResourceIds((current) => {
      if (current.includes(resourceId)) {
        return current.filter((id) => id !== resourceId);
      }
      if (current.length >= 5) return current;
      return [...current, resourceId];
    });
  };

  return (
    <section className="bg-canvas px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <p className="text-sm font-medium text-brand">Prepare a message</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-ink sm:text-4xl">
            A thoughtful way to share support.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-body">
            Choose a topic and resources, add recipient details, and review your delivery choice.
          </p>
        </header>

        <div
          role="status"
          className="mt-8 flex items-start gap-3 rounded-2xl border border-sand-border bg-sand-bg p-4 text-sand-text"
        >
          <ShieldAlertIcon className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm leading-relaxed">
            This message uses one credit from your confirmed {packageTier || 'package'} package. Your sender identity is not included in the message, but
            recipient contact details and message content are stored in the service's message records.
          </p>
        </div>

        <ol
          aria-label="Message preparation steps"
          className="mt-8 grid grid-cols-4 gap-2"
        >
          {stepLabels.map((label, index) => (
            <li
              key={label}
              aria-current={step === index ? 'step' : undefined}
              className={cn(
                'border-t-2 pt-2 text-xs font-medium sm:text-sm',
                index <= step ? 'border-brand text-brand' : 'border-line text-body'
              )}
            >
              <span className="mr-1.5">{String(index + 1).padStart(2, '0')}</span>
              {label}
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-3xl border border-line bg-surface p-5 shadow-sm sm:p-8">
          {step === 0 && (
            <div>
              <h2 className="font-serif text-2xl text-ink">What would you like to share?</h2>
              <p className="mt-2 text-sm text-body">
                Choose the topic that best matches the support you want to offer.
              </p>
              {topicsUnavailable ? (
                <p role="alert" className="mt-5 rounded-xl border border-blush-border bg-blush-bg p-4 text-sm text-blush-text">
                  Topics could not be loaded right now. Please try again later.
                </p>
              ) : topics.length === 0 ? (
                <p className="mt-5 rounded-xl border border-line bg-canvas p-4 text-sm text-body">
                  There are no topics available at the moment.
                </p>
              ) : (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {topics.map((topic) => {
                    const Icon = Object.prototype.hasOwnProperty.call(topicIcons, topic.icon)
                      ? topicIcons[topic.icon as keyof typeof topicIcons]
                      : HeartHandshakeIcon;
                    const isSelected = selectedTopicId === topic.slug;
                    return (
                      <TopicChoice
                        key={topic._id}
                        topic={topic}
                        selected={isSelected}
                        onSelect={() => {
                          setSelectedTopicId(topic.slug);
                          setSelectedResourceIds([]);
                        }}
                        icon={<Icon className="h-5 w-5" />}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-serif text-2xl text-ink">Choose resources to share</h2>
              {packageTier === 'basic' ? (
                <p className="mt-2 text-sm text-body">
                  Resource attachments are not included with the Basic package. Continue to enter the recipient.
                </p>
              ) : (
                <>
              <p className="mt-2 text-sm text-body">
                Select one or more published guides for {selectedTopic?.name || 'your topic'}. You can skip this step.
              </p>

              {resourcesUnavailable ? (
                <p role="alert" className="mt-5 rounded-xl border border-blush-border bg-blush-bg p-4 text-sm text-blush-text">
                  Published resources could not be loaded. Please try again later; no placeholder resources are shown.
                </p>
              ) : availableResources.length === 0 ? (
                <p className="mt-5 rounded-xl border border-line bg-canvas p-4 text-sm text-body">
                  There are no published resources available yet. You can continue without attaching a guide.
                </p>
              ) : (
                <>
                  <p className="mt-4 text-xs text-body">
                    Choose up to 5 resources. You can continue without selecting any.
                  </p>
                  {matchingResources.length === 0 && (
                    <p className="mt-4 text-xs text-body">
                      No guides are specifically tagged to this topic yet, so all published resources are shown.
                    </p>
                  )}
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {availableResources.map((resource) => {
                      const resourceTopic = getPublicResourceTopic(resource);
                      const selected = selectedResourceIds.includes(resource._id);
                      return (
                        <button
                          key={resource._id}
                          type="button"
                          aria-pressed={selected}
                          disabled={!selected && selectedResourceIds.length >= 5}
                          onClick={() => toggleResource(resource._id)}
                          className={cn(
                            'flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                            selected ? 'border-brand bg-brand-tint/40' : 'border-line hover:border-brand/50'
                          )}
                        >
                          <span className={cn(
                            'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                            selected ? 'bg-brand text-white' : 'bg-brand-tint text-brand'
                          )}>
                            <BookOpenIcon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-ink">{resource.title}</span>
                            <span className="mt-1 block text-xs leading-relaxed text-body">{resource.shortDescription}</span>
                            <span className="mt-2 block text-[11px] font-medium text-brand">
                              {resourceTopic?.name || 'Mental health resource'} · {resource.readingTime || 5} min read
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-serif text-2xl text-ink">Recipient and delivery</h2>
              <p className="mt-2 text-sm text-body">
                Choose how to deliver your message and enter the recipient's contact details.
              </p>

              <form className="mt-6 space-y-6" onSubmit={continueFromRecipient}>
                <fieldset>
                  <legend className="text-sm font-semibold text-ink">Delivery method</legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <DeliveryChoice
                      method="email"
                      selected={deliveryMethod === 'email'}
                      onSelect={() => setDeliveryMethod('email')}
                    />
                    <DeliveryChoice
                      method="sms"
                      selected={deliveryMethod === 'sms'}
                      onSelect={() => setDeliveryMethod('sms')}
                    />
                  </div>
                </fieldset>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-medium text-ink">
                    Recipient name <span className="font-normal text-body">(optional)</span>
                    <input
                      className={fieldClassName}
                      autoComplete="off"
                      maxLength={100}
                      value={recipient.name}
                      onChange={(event) => updateRecipient('name', event.target.value)}
                      placeholder="Name"
                    />
                  </label>

                  {deliveryMethod === 'email' ? (
                    <label className="text-sm font-medium text-ink">
                      Recipient email
                      <input
                        className={fieldClassName}
                        type="email"
                        autoComplete="off"
                        required
                        maxLength={254}
                        value={recipient.email}
                        onChange={(event) => updateRecipient('email', event.target.value)}
                        placeholder="name@example.com"
                      />
                    </label>
                  ) : (
                    <label className="text-sm font-medium text-ink">
                      Recipient phone number
                      <input
                        className={fieldClassName}
                        type="tel"
                        autoComplete="off"
                        required
                        minLength={7}
                        maxLength={25}
                        value={recipient.phone}
                        onChange={(event) => updateRecipient('phone', event.target.value)}
                        placeholder="+1 555 123 4567"
                      />
                    </label>
                  )}
                </div>

                <label className="block text-sm font-medium text-ink">
                  Optional note
                  <textarea
                    className={cn(fieldClassName, 'min-h-28 resize-y')}
                    maxLength={500}
                    value={recipient.note}
                    onChange={(event) => updateRecipient('note', event.target.value)}
                    placeholder="Add a short, supportive note (optional)"
                  />
                  <span className="mt-1 block text-xs font-normal text-body">
                    {recipient.note.length}/500 characters
                  </span>
                </label>

                <div className="flex justify-between border-t border-line pt-5">
                  <BackButton onClick={() => setStep(1)} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
                  >
                    Review details <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && selectedTopic && (
            <div>
              <h2 className="font-serif text-2xl text-ink">Review your choices</h2>
              <p className="mt-2 text-sm text-body">
                Confirm the recipient, resource links, and delivery method before sending.
              </p>

              <dl className="mt-6 divide-y divide-line rounded-2xl border border-line px-4">
                <ReviewRow label="Topic" onEdit={() => setStep(0)}>
                  <span>{selectedTopic.name}</span>
                </ReviewRow>
                <ReviewRow label="Resources" onEdit={() => setStep(1)}>
                  <span>
                    {selectedResources.length > 0
                      ? selectedResources.map((resource) => resource.title).join(', ')
                      : 'None selected'}
                  </span>
                </ReviewRow>
                <ReviewRow label="Delivery" onEdit={() => setStep(2)}>
                  <span className="inline-flex items-center gap-2">
                    {deliveryMethod === 'email' ? (
                      <MailIcon className="h-4 w-4 text-brand" />
                    ) : (
                      <MessageSquareTextIcon className="h-4 w-4 text-brand" />
                    )}
                    {deliveryMethod === 'email' ? 'Email' : 'SMS'} ·{' '}
                    {maskDestination(deliveryMethod, recipient)}
                  </span>
                </ReviewRow>
                {recipient.name.trim() && (
                  <ReviewRow label="Recipient name" onEdit={() => setStep(2)}>
                    <span>{recipient.name.trim()}</span>
                  </ReviewRow>
                )}
                {recipient.note.trim() && (
                  <ReviewRow label="Note" onEdit={() => setStep(2)}>
                    <span className="whitespace-pre-wrap">{recipient.note.trim()}</span>
                  </ReviewRow>
                )}
              </dl>

              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-canvas p-4 text-sm text-body">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-brand"
                  checked={confirmsSending}
                  onChange={(event) => setConfirmsSending(event.target.checked)}
                />
                <span>
                  I confirm I have a good-faith reason to contact this person and this message is supportive, not
                  threatening or harassing. I understand this uses one package credit, my identity is not shown
                  to the recipient, and recipient contact details and message content are retained in service records.
                </span>
              </label>

              {sendError && (
                <p role="alert" className="mt-4 rounded-xl border border-blush-border bg-blush-bg p-3 text-sm text-blush-text">
                  {sendError}
                </p>
              )}

              <div className="mt-6 flex justify-between border-t border-line pt-5">
                <BackButton onClick={() => setStep(2)} />
                <button
                  type="button"
                  onClick={async () => {
                    if (!selectedTopic) {
                      setSendError('Please select a topic before sending.');
                      setStep(0);
                      return;
                    }
                    setIsSending(true);
                    setSendError('');
                    idempotencyKeyRef.current ??= crypto.randomUUID();
                    try {
                      const response = await fetch('/api/messages', {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: {
                          'Content-Type': 'application/json',
                          'Idempotency-Key': idempotencyKeyRef.current,
                        },
                        body: JSON.stringify({
                          channel: deliveryMethod,
                          packagePurchaseId,
                          topic: selectedTopic._id,
                          articles: selectedResourceIds,
                          senderAttestation: true,
                          recipientName: recipient.name.trim() || undefined,
                          recipientEmail: deliveryMethod === 'email' ? recipient.email.trim() : undefined,
                          recipientPhone: deliveryMethod === 'sms' ? recipient.phone.trim() : undefined,
                          customNote: recipient.note.trim() || undefined,
                        }),
                      });
                      const result = await response.json() as { message?: string; error?: string; success?: boolean };
                      if (!response.ok || result.success === false) {
                        throw new Error(result.error || result.message || 'The message could not be sent.');
                      }
                      setCompleted(true);
                    } catch (error) {
                      setSendError(error instanceof Error ? error.message : 'The message could not be sent.');
                    } finally {
                      setIsSending(false);
                    }
                  }}
                  disabled={!confirmsSending || isSending}
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSending ? 'Sending…' : 'Send anonymously'}
                  <CheckCircle2Icon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step < 2 && (
            <div className="mt-7 flex justify-between border-t border-line pt-5">
              {step === 1 ? <BackButton onClick={() => setStep(0)} /> : <span />}
              <button
                type="button"
                disabled={step === 0 && !selectedTopicId}
                onClick={() => setStep((current) => current + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TopicChoice({
  topic,
  selected,
  onSelect,
  icon,
}: {
  topic: PublicTopic;
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors',
        selected ? 'border-brand bg-brand-tint/40' : 'border-line hover:border-brand/50'
      )}
    >
      <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border', toneStyles[topic.tone].pill)}>
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold text-ink">{topic.name}</span>
        <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-body">{topic.shortDescription}</span>
      </span>
    </button>
  );
}

function DeliveryChoice({
  method,
  selected,
  onSelect,
}: {
  method: DeliveryMethod;
  selected: boolean;
  onSelect: () => void;
}) {
  const isEmail = method === 'email';
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors',
        selected ? 'border-brand bg-brand-tint/40' : 'border-line hover:border-brand/50'
      )}
    >
      <input
        type="radio"
        name="deliveryMethod"
        value={method}
        checked={selected}
        onChange={onSelect}
        className="h-4 w-4 accent-brand"
      />
      {isEmail ? <MailIcon className="h-5 w-5 text-brand" /> : <MessageSquareTextIcon className="h-5 w-5 text-brand" />}
      <span>
        <span className="block text-sm font-semibold text-ink">{isEmail ? 'Email' : 'SMS'}</span>
        <span className="mt-0.5 block text-xs text-body">{isEmail ? 'Send to an email address' : 'Send to a phone number'}</span>
      </span>
    </label>
  );
}

function ReviewRow({
  label,
  children,
  onEdit,
}: {
  label: string;
  children: React.ReactNode;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <dt className="shrink-0 text-xs font-semibold uppercase tracking-wide text-body">{label}</dt>
      <dd className="flex min-w-0 items-center gap-3 text-right text-sm text-ink">
        <span className="min-w-0 break-words">{children}</span>
        {onEdit && (
          <button type="button" onClick={onEdit} className="shrink-0 text-xs font-medium text-brand hover:underline">
            Edit
          </button>
        )}
      </dd>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-brand"
    >
      <ArrowLeftIcon className="h-4 w-4" /> Back
    </button>
  );
}
