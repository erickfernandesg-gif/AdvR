'use client';

import Link from 'next/link';
import { TechnicalFocusContent } from '@/types/blocks';

export default function TechnicalFocus({ content }: { content: TechnicalFocusContent }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="glow-card bg-background border border-border p-8 sm:p-12 rounded-3xl shadow-sm">
        <p className="section-eyebrow mb-4">Segurança e governança</p>
        <h2 className="text-3xl font-display font-bold mb-8 text-foreground">{content.title}</h2>
        <ul className="space-y-6">
          {content.features?.map((feature, i: number) => (
            <li key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined">{feature.icon}</span>
              </div>
              <div>
                <h4 className="font-bold mb-1 text-foreground">{feature.title}</h4>
                <p className="text-muted-foreground text-sm font-light">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-12">
        <h2 className="text-3xl font-display font-bold text-foreground mb-6">{content.cta_title}</h2>
        <p className="text-muted-foreground font-light leading-relaxed mb-8">
          {content.cta_description}
        </p>
        <Link href="/contato" className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-500">
          {content.cta_button}
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
