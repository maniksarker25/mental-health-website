export type Tone = 'sky' | 'lavender' | 'sand' | 'blush' | 'mist';

export type IconKey =
'wind' |
'moon' |
'cloudRain' |
'shieldAlert' |
'batteryLow' |
'users' |
'heartCrack' |
'repeat' |
'pillBottle';

export interface Symptom {
  label: string;
  description: string;
  kind: 'Body' | 'Mind' | 'Behavior';
}

export interface MythFact {
  myth: string;
  fact: string;
}

export interface Strategy {
  name: string;
  summary: string;
  steps: string[];
}

export interface Treatment {
  name: string;
  abbreviation: string;
  description: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface PacerPreset {
  label: string;
  inhale: number;
  hold: number;
  exhale: number;
  description: string;
}

export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tone: Tone;
  icon: IconKey;
  keywords: string[];
  readingTime: number;
  featuredImage: string;
  excerpt: string;
  reviewer: string;
  updated: string;
  intro: string[];
  mechanics: {
    heading: string;
    body: string[];
  };
  symptoms: Symptom[];
  myths: MythFact[];
  strategies: Strategy[];
  treatments: Treatment[];
  support: {
    guidance: string;
    say: string[];
    avoid: string[];
  };
  faqs: Faq[];
  pacer: PacerPreset[];
}

export type InquiryType =
'General question' |
'Clinical collaboration' |
'Product feedback' |
'Media enquiry';

export interface ContactSubmission {
  name: string;
  email: string;
  inquiryType: InquiryType;
  message: string;
  submittedAt: string;
}