'use client';

import { CultureContent } from '@/types/blocks';

export default function CultureSection({ content }: { content: CultureContent }) {
  return (
    <section className="bg-background border-2 border-primary/10 p-16 rounded-[4rem] text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 shadow-sm">
      <h2 className="text-4xl font-display font-bold mb-8 tracking-tight text-foreground">{content.title}</h2>
      <p className="text-muted-foreground font-light text-lg max-w-2xl mx-auto leading-relaxed mb-12">
        {content.description}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {content.tags?.map((tag, i: number) => (
          <span key={i} className="px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-bold uppercase tracking-widest">{tag}</span>
        ))}
      </div>
    </section>
  );
}
