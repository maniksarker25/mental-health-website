import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PhoneCallIcon } from 'lucide-react';
import { crisisLines } from '../data/site';

const resourceLinks = [
  { label: 'Anxiety & Panic', href: '/resources' },
  { label: 'Depression', href: '/resources' },
  { label: 'Stress & Burnout', href: '/resources' },
  { label: 'Grief & Loss', href: '/resources' },
  { label: 'Sleep', href: '/resources' },
];

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Clinical Review Board', href: '/about' },
  { label: 'Privacy Approach', href: '#' },
  { label: 'Contact', href: '/contact' },
];

const communityLinks = [
  { label: 'Supporter Stories', href: '/community' },
  { label: 'For Schools', href: '#' },
  { label: 'For Workplaces', href: '#' },
  { label: 'Partner With Us', href: '/contact' },
];

export function Footer() {
  const lifeline = crisisLines[0];

  return (
    <footer className="no-print border-t border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Urgent banner */}
        <div className="flex flex-col gap-4 rounded-2xl border border-brand/20 bg-brand-tint px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-lg text-ink">
              If you or someone you know is in immediate danger, reach a human now.
            </p>
            <p className="mt-1 text-sm text-body">
              The 988 Suicide & Crisis Lifeline is free, confidential, and available 24/7 across the United States.
            </p>
          </div>
          <a
            href={lifeline.target}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform duration-150 ease-gentle hover:scale-[1.02]"
          >
            <PhoneCallIcon className="h-4 w-4" />
            Call or Text 988
          </a>
        </div>

        {/* Columns */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image
              src="/logo.png"
              alt="Mental Health Support"
              width={1800}
              height={400}
              className="h-9 w-auto object-contain"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-body">
              Anonymous, clinically reviewed mental health resources you can send to someone who is not ready to
              talk yet.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ink">Resources</h2>
            <ul className="mt-4 space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-body transition-colors duration-150 ease-gentle hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ink">Company</h2>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-body transition-colors duration-150 ease-gentle hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ink">Community</h2>
            <ul className="mt-4 space-y-2.5">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-body transition-colors duration-150 ease-gentle hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer + Bottom bar */}
        <div className="mt-12 border-t border-line pt-6">
          <p className="max-w-3xl text-xs leading-relaxed text-body">
            <span className="font-semibold text-ink">Medical disclaimer.</span> The material on this site is
            educational and is not a substitute for professional diagnosis, treatment, or emergency care. It does
            not create a clinician–patient relationship. If you are in immediate danger, call your local emergency
            number or 988 in the United States.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-body">
              © {new Date().getFullYear()} Mental Health Support. Educational resources only — not a substitute for
              professional care.
            </p>
            <div className="flex items-center gap-5 text-xs text-body">
              <Link href="#" className="transition-colors duration-150 ease-gentle hover:text-ink">
                Privacy Approach
              </Link>
              <Link href="#" className="transition-colors duration-150 ease-gentle hover:text-ink">
                Terms
              </Link>
              <Link href="#" className="transition-colors duration-150 ease-gentle hover:text-ink">
                Zero Retention Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}