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
    tagline: 'Send a message without including your sender identity.',
    price: 49,
    paymentType: 'One-time payment',
    popular: false,
    description:
      'Send an email or SMS that does not include your sender identity.',
    features: [
      'Can send anonymous message anytime (24/7)',
      'Recipient contact details are retained in service records',
      'Send via secure SMS or private Email',
      'No sender identity included in the delivered message',
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
      'Each package includes one SMS or email message. The delivered message does not include the sender’s account identity. Recipient contact information and message content are retained in service records.',
  },
  {
    question: 'What resources can I attach in the Standard plan?',
    answer:
      'In the Standard plan, you can attach any of our clinically vetted educational guides (Anxiety & Panic, Depression, Burnout, Grief, Sleep, etc.) directly to your anonymous message.',
  },
  {
    question: 'How is the consultation with Dr. Skelton scheduled in Premium?',
    answer:
      'The Premium package includes a 1-on-1 consultation. Booking is arranged separately after purchase; an automatic booking-link delivery is not yet available.',
  },
];
