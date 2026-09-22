'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MenuIcon,
  MoonIcon,
  PhoneCallIcon,
  SunIcon,
  XIcon,
  LogInIcon,
  UserPlusIcon,
  LogOutIcon,
  UserIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { navLinks } from '../data/site';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils/cn';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully.');
    router.push('/');
  };

  return (
    <header className="no-print sticky top-0 z-50 border-b border-line bg-canvas">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Mental Health Support home">
          <Image
            src="/logo.png"
            alt="Mental Health Support"
            width={1800}
            height={400}
            priority
            className="h-8 w-auto object-contain sm:h-9 lg:h-10"
          />
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
          {/* 988 Helpline */}
          <a
            href="tel:988"
            className="hidden items-center gap-2 rounded-full bg-brand/10 text-brand border border-brand/20 px-3.5 py-1.5 text-xs font-semibold transition-transform duration-150 ease-gentle hover:bg-brand hover:text-white sm:inline-flex"
          >
            <PhoneCallIcon className="h-3.5 w-3.5" />
            <span>988 Lifeline</span>
          </a>

          {/* Auth State Button */}
          {isAuthenticated && user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink font-medium">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                  {user.initials}
                </span>
                <span className="max-w-[110px] truncate">{user.name}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-body transition-colors hover:border-danger hover:bg-danger-bg hover:text-danger"
              >
                <LogOutIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-body transition-colors hover:bg-surface hover:text-ink"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-transform hover:scale-[1.02]"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-body transition-colors duration-150 ease-gentle hover:border-brand hover:text-ink"
          >
            {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-body transition-colors duration-150 ease-gentle hover:border-brand hover:text-ink lg:hidden"
          >
            {open ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
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
                      'rounded-xl px-4 py-2.5 text-sm transition-colors duration-150 ease-gentle',
                      isActive ? 'bg-brand-tint text-ink font-medium' : 'text-body hover:text-ink'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-line" />

              {/* Mobile Auth Options */}
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                      {user.initials}
                    </span>
                    <span className="text-sm font-semibold text-ink">{user.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs font-semibold text-danger hover:underline"
                  >
                    <LogOutIcon className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-line py-2.5 text-xs font-semibold text-ink hover:bg-canvas"
                  >
                    <LogInIcon className="h-3.5 w-3.5" />
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-xs font-semibold text-white"
                  >
                    <UserPlusIcon className="h-3.5 w-3.5" />
                    Register
                  </Link>
                </div>
              )}

              <a
                href="tel:988"
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-brand/10 text-brand border border-brand/20 px-4 py-2.5 text-xs font-semibold"
              >
                <PhoneCallIcon className="h-3.5 w-3.5" />
                24/7 Lifeline · Call or Text 988
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}