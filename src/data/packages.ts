export interface PackageFeature {
  name: string;
  included: boolean;
  note?: string;
}

export interface PackageTier {
  id: string;
  name: string;
  tagline: string;
  price: number;
  paymentType: string;
  popular?: boolean;
  badge?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  idealFor: string;
}

export const packagesData: PackageTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Send confidential anonymous messages anytime with complete privacy.',
    price: 49,
    paymentType: 'One-time payment',
    popular: false,
    description:
      'Allows you to send an anonymous message without revealing your identity, phone number, or IP address.',
    features: [
      'Can send anonymous message anytime (24/7)',
      '100% confidential & zero data retention',
      'Send via secure SMS or private Email',
      'No sender identity or personal details attached',
      'Zero account requirement for the recipient',
    ],
    ctaLabel: 'Get Basic',
    ctaHref: '/contact?plan=basic',
    idealFor: 'Individuals looking to send a quiet, anonymous text or email message.',
  },
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'Send anonymous message and attach clinically vetted mental health resources.',
    price: 79,
    paymentType: 'One-time payment',
    popular: true,
    badge: 'Most Popular',
    description:
      'Send an anonymous message and seamlessly attach clinically reviewed mental health resource guides.',
    features: [
      'Everything included in Basic',
      'Can send anonymous message anytime',
      'Add & attach clinically reviewed resources to message',
      'Full access to Anxiety, Depression, Burnout & Grief guides',
      'Customizable empathetic message templates with resource links',
    ],
    ctaLabel: 'Get Standard',
    ctaHref: '/contact?plan=standard',
    idealFor: 'Caregivers and supporters wanting to provide both a message and helpful resources.',
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Anonymous message with resources plus a 1-on-1 consultation with Dr. Skelton.',
    price: 149,
    paymentType: 'One-time payment',
    popular: false,
    badge: 'Comprehensive Care',
    description:
      'Anonymous message dispatch with attached resources, plus a dedicated personal consultation session with Dr. Skelton.',
    features: [
      'Everything included in Standard',
      'Can send anonymous message with attached resources anytime',
      'Personal 1-on-1 consultation session with Dr. Skelton',
      'Custom clinical guidance & tailored support strategy',
    ],
    ctaLabel: 'Get Premium',
    ctaHref: '/contact?plan=premium',
    idealFor: 'Anyone seeking resource dispatching combined with professional clinical consultation.',
  },
];

export const packageFaqs = [
  {
    question: 'Are these packages recurring subscriptions or one-time payments?',
    answer:
      'All packages are 100% one-time payments. There are no monthly fees, no yearly commitments, and no recurring charges.',
  },
  {
    question: 'How do anonymous messages work in the Basic plan?',
    answer:
      'With the Basic plan, you can dispatch an anonymous message via SMS or Email. We strip all sender information, IP addresses, and phone numbers in memory so your identity is completely protected.',
  },
  {
    question: 'What resources can I attach in the Standard plan?',
    answer:
      'In the Standard plan, you can attach any of our clinically vetted educational guides (Anxiety & Panic, Depression, Burnout, Grief, Sleep, etc.) directly to your anonymous message.',
  },
  {
    question: 'How is the consultation with Dr. Skelton scheduled in Premium?',
    answer:
      'Upon purchasing the Premium package, you will receive a private booking link to schedule your 1-on-1 consultation session with Dr. Skelton at a time convenient for you.',
  },
];
