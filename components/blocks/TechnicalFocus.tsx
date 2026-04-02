'use client';

import { TechnicalFocusContent } from '@/types/blocks';

export default function TechnicalFocus({ content }: { content: TechnicalFocusContent }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <div className="glow-card bg-background border-2 border-border p-12 rounded-[3rem] shadow-sm">
        <h3 className="text-3xl font-display font-bold mb-8 text-foreground">{content.title}</h3>
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
        <h3 className="text-3xl font-display font-bold text-foreground mb-6">{content.cta_title}</h3>
        <p className="text-muted-foreground font-light leading-relaxed mb-8">
          {content.cta_description}
        </p>
        <button className="btn-premium w-fit">
          {content.cta_button}
        </button>
      </div>
    </section>
  );
}
