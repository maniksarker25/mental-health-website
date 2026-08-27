'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, MoonIcon, PhoneCallIcon, SunIcon, XIcon } from 'lucide-react';
import { navLinks } from '../data/site';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../utils/cn';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-line bg-canvas">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Mental Health Support home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none">
              <path
                d="M12 20s-7-4.3-7-9.2A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7 2.8C19 15.7 12 20 12 20Z"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path d="M8.5 12.2h2l1-1.8 1.4 3 1-1.2h1.6" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-[15px] font-semibold leading-tight text-ink">
            Mental Health
            <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-body">Support</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                href={link.to}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm transition-colors duration-150 ease-gentle',
                  isActive ? 'bg-brand-tint text-ink font-medium' : 'text-body hover:text-ink'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:988"
            className="hidden items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-transform duration-150 ease-gentle hover:scale-[1.02] sm:inline-flex"
          >
            <PhoneCallIcon className="h-4 w-4" />
            <span className="whitespace-nowrap">24/7 · Call or Text 988</span>
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-body transition-colors duration-150 ease-gentle hover:border-brand hover:text-ink"
          >
            {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-body transition-colors duration-150 ease-gentle hover:border-brand hover:text-ink lg:hidden"
          >
            {open ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden border-t border-line bg-surface lg:hidden"
          >
            <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              {navLinks.map((link) => {
                const isActive = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    href={link.to}
                    className={cn(
                      'rounded-xl px-4 py-3 text-sm transition-colors duration-150 ease-gentle',
                      isActive ? 'bg-brand-tint text-ink font-medium' : 'text-body hover:text-ink'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href="tel:988"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white"
              >
                <PhoneCallIcon className="h-4 w-4" />
                24/7 Crisis · Call or Text 988
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}