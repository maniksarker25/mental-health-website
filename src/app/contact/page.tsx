import { ContactForm } from '../../components/ContactForm';
import { fetchPublicFaqs } from '../../lib/server/manageWeb';
import type { PublicFaq } from '../../types/manageWeb';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  let faqs: PublicFaq[] = [];
  let faqLoadFailed = false;

  try {
    faqs = await fetchPublicFaqs();
  } catch (error) {
    console.error('Unable to load contact page FAQs:', error);
    faqLoadFailed = true;
  }

  return <ContactForm faqs={faqs} faqLoadFailed={faqLoadFailed} />;
}
