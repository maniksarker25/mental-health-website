'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpenIcon, HeartHandshakeIcon, SendIcon } from 'lucide-react';
import { howItWorks } from '../../data/site';

const icons = [BookOpenIcon, SendIcon, HeartHandshakeIcon];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-brand">How it works</p>
        <h2 id="how-heading" className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
          Three steps, and none of them require you to explain yourself.
        </h2>
      </div>

      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {howItWorks.map((item, index) => {
          const Icon = icons[index];
          return (
            <motion.li
              key={item.step}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.28, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
              className="flex h-full flex-col rounded-3xl border border-line bg-surface p-6">
              
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-tint text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-body">Step {index + 1}</span>
              </div>
              <h3 className="mt-5 font-serif text-xl text-ink">{item.step}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-body">{item.body}</p>
              <p className="mt-auto pt-5 text-xs font-medium text-brand">{item.detail}</p>
            </motion.li>);

        })}
      </ol>
    </section>);

}