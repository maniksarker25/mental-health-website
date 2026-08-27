import type { Topic } from '../types/topic';

export function countSections(topic: Topic): number {
  const blocks = [
  topic.pacer.length > 0,
  topic.intro.length > 0,
  topic.mechanics.body.length > 0,
  topic.symptoms.length > 0,
  topic.myths.length > 0,
  topic.strategies.length > 0,
  topic.treatments.length > 0,
  topic.support.say.length > 0,
  topic.faqs.length > 0,
  true, // crisis helplines
  true // medical disclaimer
  ];
  return blocks.filter(Boolean).length;
}

export function searchTopics(topics: Topic[], query: string, category: string): Topic[] {
  const term = query.trim().toLowerCase();
  return topics.filter((topic) => {
    const matchesCategory = category === 'All Topics' || topic.category === category;
    if (!matchesCategory) return false;
    if (!term) return true;
    const haystack = [topic.title, topic.subtitle, topic.excerpt, topic.category, ...topic.keywords].
    join(' ').
    toLowerCase();
    return haystack.includes(term);
  });
}