export interface CrisisLine {
  name: string;
  contact: string;
  action: 'call' | 'text';
  target: string;
  description: string;
}

export const crisisLines: CrisisLine[] = [
{
  name: '988 Suicide & Crisis Lifeline',
  contact: 'Call or text 988',
  action: 'call',
  target: 'tel:988',
  description: 'Free, confidential support 24/7 for anyone in emotional distress — not only suicidal crisis.'
},
{
  name: 'Crisis Text Line',
  contact: 'Text HOME to 741741',
  action: 'text',
  target: 'sms:741741?&body=HOME',
  description: 'Text-first support with a trained volunteer crisis counselor, usually within five minutes.'
},
{
  name: 'SAMHSA National Helpline',
  contact: 'Call 1-800-662-4357',
  action: 'call',
  target: 'tel:18006624357',
  description: 'Treatment referrals and information for substance use and co-occurring conditions.'
}];


export const navLinks = [
{ label: 'Home', to: '/' },
{ label: 'Articles & Topics', to: '/articles' },
{ label: 'About Us', to: '/about' },
{ label: 'Contact', to: '/contact' }];


export const howItWorks = [
{
  step: 'Choose a topic',
  body: 'Start from a clinically grounded guide — anxiety, burnout, grief, trauma, sleep and more. Each one is written in plain language, without diagnosis or jargon.',
  detail: 'Nine guides, reviewed quarterly'
},
{
  step: 'Dispatch anonymously',
  body: 'Send the resource as a plain link by SMS or email. Your name is never attached, nothing is logged, and the link contains no identifiers or tracking parameters.',
  detail: 'No sender identity, no read receipts'
},
{
  step: 'Support arrives gently',
  body: 'They open a quiet, ad-free guide with grounding tools, coping strategies and helplines — and read it at their own pace, with no account and no follow-up.',
  detail: 'No sign-up, no email capture'
}];


export const contactFaqs = [
{
  question: 'Can you tell me who sent me a resource link?',
  answer:
  'No. We never record who dispatches a resource, so there is nothing for us to look up. Dispatches carry no sender identity, IP address, or device fingerprint.'
},
{
  question: 'Do you offer therapy or crisis counselling?',
  answer:
  'We do not. We are an educational library and dispatch service. For care, contact a licensed clinician; for an emergency, call or text 988.'
},
{
  question: 'How do I request a new topic guide?',
  answer:
  'Send us a note with the inquiry type set to Product feedback. Requested topics enter our clinical review queue and are prioritised by how often they are asked for.'
},
{
  question: 'Can my clinic or campus reuse these guides?',
  answer:
  'Yes. Every guide is print-optimised and free to distribute in clinical, school, or workplace settings. Choose Clinical collaboration and we will send the print pack.'
}];


export const commitments = [
{
  title: 'Zero retention',
  body: 'Dispatch requests are processed in memory and discarded. We keep no message logs, no recipient lists, and no IP records.'
},
{
  title: 'Zero advertising',
  body: 'No ad tech, no sponsored treatment placements, no affiliate links to clinics or supplements. Nothing you read here was paid for.'
},
{
  title: 'Zero behavioural tracking',
  body: 'No third-party analytics, no pixels, no cross-site cookies. We cannot build a profile of you because we never collect one.'
}];


export const advisors = [
{
  name: 'Dr. Sarah Jenkins, PsyD',
  role: 'Clinical Director, Anxiety & Trauma',
  focus: 'Reviews exposure-based and grounding content; 14 years in outpatient CBT practice.'
},
{
  name: 'Dr. Marcus Oyelaran, MD',
  role: 'Consulting Psychiatrist',
  focus: 'Reviews medication, sleep and substance-use sections for medical accuracy.'
},
{
  name: 'Renée Alvarez, LCSW',
  role: 'Family & Caregiver Lead',
  focus: 'Writes the “how to support a loved one” guidance and exact-phrasing scripts.'
},
{
  name: 'Dr. Priya Raman, PhD',
  role: 'Research & Plain-Language Editor',
  focus: 'Checks every claim against current literature and rewrites it at a 7th-grade reading level.'
}];