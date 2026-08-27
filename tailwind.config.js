/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand)',
          strong: 'var(--brand-strong)',
          tint: 'var(--brand-tint)',
        },
        canvas: 'var(--canvas)',
        surface: {
          DEFAULT: 'var(--surface)',
          sunken: 'var(--surface-sunken)',
        },
        ink: 'var(--ink)',
        body: 'var(--body)',
        line: 'var(--line)',
        sky: {
          bg: 'var(--tone-sky-bg)',
          border: 'var(--tone-sky-border)',
          text: 'var(--tone-sky-text)',
        },
        lavender: {
          bg: 'var(--tone-lavender-bg)',
          border: 'var(--tone-lavender-border)',
          text: 'var(--tone-lavender-text)',
        },
        sand: {
          bg: 'var(--tone-sand-bg)',
          border: 'var(--tone-sand-border)',
          text: 'var(--tone-sand-text)',
        },
        blush: {
          bg: 'var(--tone-blush-bg)',
          border: 'var(--tone-blush-border)',
          text: 'var(--tone-blush-text)',
        },
        mist: {
          bg: 'var(--tone-mist-bg)',
          border: 'var(--tone-mist-border)',
          text: 'var(--tone-mist-text)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
      transitionTimingFunction: {
        gentle: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
};
