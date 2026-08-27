import React from 'react';

interface ArticleSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}

export function ArticleSection({ id, eyebrow, title, intro, children }: ArticleSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 border-t border-line pt-12">
      <p className="text-sm font-medium text-brand">{eyebrow}</p>
      <h2 id={`${id}-heading`} className="mt-3 max-w-2xl font-serif text-3xl leading-tight text-ink">
        {title}
      </h2>
      {intro && <p className="mt-4 max-w-prose text-base leading-relaxed text-body">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>);

}