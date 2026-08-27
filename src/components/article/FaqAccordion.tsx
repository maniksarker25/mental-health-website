'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import type { Faq } from '../../types/topic';

interface FaqAccordionProps {
  faqs: Faq[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition-colors duration-150 ease-gentle hover:bg-canvas sm:px-6">
                
                <span className="text-[15px] font-medium leading-snug text-ink">{faq.question}</span>
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="mt-0.5 shrink-0 text-brand">
                  
                  <PlusIcon className="h-5 w-5" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen &&
              <motion.div
                id={`faq-panel-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden">
                
                  <p className="px-5 pb-5 text-sm leading-relaxed text-body sm:px-6">{faq.answer}</p>
                </motion.div>
              }
            </AnimatePresence>
          </div>);

      })}
    </div>);

}