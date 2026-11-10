import type { Metadata } from 'next';
import { PackagesSection } from '../../components/home/PackagesSection';

export const metadata: Metadata = {
  title: 'Packages — Mental Health Anonymous',
  description:
    'Explore one-time anonymous support packages with private message dispatch and clinically reviewed mental health resources.',
};

export default function PackagesPage() {
  return <PackagesSection standalone />;
}
