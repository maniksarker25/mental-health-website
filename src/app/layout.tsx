import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mentalhealthsupport.app'),
  title: 'Mental Health Support — Anonymous Resource Dispatch',
  description:
    'Choose a clinically reviewed mental health guide and dispatch it anonymously via SMS or email with zero tracking, zero accounts, and complete privacy.',
  keywords: [
    'mental health',
    'support guides',
    'anonymous help',
    'anxiety',
    'depression',
    'burnout',
    'grounding tools',
    'crisis resources',
  ],
  authors: [{ name: 'Mental Health Support Clinical Team' }],
  openGraph: {
    title: 'Mental Health Support — Anonymous Resource Dispatch',
    description:
      'Send a calm, shame-free educational guide to someone who needs it. Zero retention, no accounts, 100% confidential.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Mental Health Support',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mental Health Support — Anonymous Resource Dispatch',
    description:
      'Send a calm, shame-free educational guide to someone who needs it. Zero retention, no accounts, 100% confidential.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f6f2' },
    { media: '(prefers-color-scheme: dark)', color: '#121816' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen w-full flex-col bg-canvas text-body antialiased">
        <ThemeProvider>
          <a
            href="#main"
            className="no-print sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:text-white"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-center" theme="system" />
        </ThemeProvider>
      </body>
    </html>
  );
}
