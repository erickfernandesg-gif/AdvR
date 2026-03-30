'use client';

import { SocialProofContent } from '@/types/blocks';

export default function SocialProof({ content }: { content: SocialProofContent }) {
  return (
    <section className="py-16 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-10">{content.title}</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
          {content.companies?.map((company: string, i: number) => (
            <span key={i} className="text-2xl font-display font-black tracking-tighter text-foreground">{company}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
