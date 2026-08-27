import React from 'react';
import Link from 'next/link';
import { LockIcon, PhoneCallIcon } from 'lucide-react';
import { crisisLines, navLinks } from '../data/site';

export function Footer() {
  return (
    <footer className="no-print border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-serif text-2xl text-ink">Mental Health Support</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-body">
              An anonymous resource dispatch service. Choose a clinically reviewed guide, send it to someone who needs
              it, and let the material do the part that is hard to say out loud.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-2 text-xs text-body">
              <LockIcon className="h-3.5 w-3.5 text-brand" />
              Zero retention · no accounts · no tracking
            </p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ink">Pages</h2>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    className="text-sm text-body transition-colors duration-150 ease-gentle hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#download-app"
                  className="text-sm text-body transition-colors duration-150 ease-gentle hover:text-ink"
                >
                  Mobile App
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ink">If it is urgent</h2>
            <ul className="mt-4 space-y-3">
              {crisisLines.map((line) => (
                <li key={line.name}>
                  <a
                    href={line.target}
                    className="group flex items-start gap-2.5 text-sm text-body transition-colors duration-150 ease-gentle hover:text-ink"
                  >
                    <PhoneCallIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>
                      <span className="block font-medium text-ink">{line.contact}</span>
                      {line.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <p className="max-w-3xl text-xs leading-relaxed text-body">
            <span className="font-semibold text-ink">Medical disclaimer.</span> The material on this site is
            educational and is not a substitute for professional diagnosis, treatment, or emergency care. It does not
            create a clinician–patient relationship. If you are in immediate danger, call your local emergency number or
            988 in the United States.
          </p>
          <p className="mt-4 text-xs text-body">
            © {new Date().getFullYear()} Mental Health Support. Guides reviewed by licensed clinicians.
          </p>
        </div>
      </div>
    </footer>
  );
}