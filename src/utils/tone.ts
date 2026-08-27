import {
  BatteryLowIcon,
  CloudRainIcon,
  HeartCrackIcon,
  type LucideIcon,
  MoonIcon,
  PillBottleIcon,
  RepeatIcon,
  ShieldAlertIcon,
  UsersIcon,
  WindIcon } from
'lucide-react';
import type { IconKey, Tone } from '../types/topic';

export const toneStyles: Record<Tone, {pill: string;panel: string;text: string;dot: string;}> = {
  sky: {
    pill: 'bg-sky-bg border-sky-border text-sky-text',
    panel: 'bg-sky-bg border-sky-border',
    text: 'text-sky-text',
    dot: 'bg-sky-text'
  },
  lavender: {
    pill: 'bg-lavender-bg border-lavender-border text-lavender-text',
    panel: 'bg-lavender-bg border-lavender-border',
    text: 'text-lavender-text',
    dot: 'bg-lavender-text'
  },
  sand: {
    pill: 'bg-sand-bg border-sand-border text-sand-text',
    panel: 'bg-sand-bg border-sand-border',
    text: 'text-sand-text',
    dot: 'bg-sand-text'
  },
  blush: {
    pill: 'bg-blush-bg border-blush-border text-blush-text',
    panel: 'bg-blush-bg border-blush-border',
    text: 'text-blush-text',
    dot: 'bg-blush-text'
  },
  mist: {
    pill: 'bg-mist-bg border-mist-border text-mist-text',
    panel: 'bg-mist-bg border-mist-border',
    text: 'text-mist-text',
    dot: 'bg-mist-text'
  }
};

export const topicIcons: Record<IconKey, LucideIcon> = {
  wind: WindIcon,
  moon: MoonIcon,
  cloudRain: CloudRainIcon,
  shieldAlert: ShieldAlertIcon,
  batteryLow: BatteryLowIcon,
  users: UsersIcon,
  heartCrack: HeartCrackIcon,
  repeat: RepeatIcon,
  pillBottle: PillBottleIcon
};