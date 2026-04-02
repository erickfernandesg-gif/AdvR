'use client';

import * as motion from "motion/react-client";
import { SocialProofContent } from '@/types/blocks';

export default function SocialProof({ content }: { content: SocialProofContent }) {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">{content.title}</p>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex whitespace-nowrap gap-16 md:gap-32 items-center"
        >
          {/* Double the items for seamless loop */}
          {[...content.companies, ...content.companies].map((company: string, i: number) => (
            <div key={i} className="flex items-center gap-4 opacity-30 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-default">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">corporate_fare</span>
              </div>
              <span className="text-3xl md:text-4xl font-display font-black tracking-tighter text-foreground uppercase">{company}</span>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Subtle bottom border with gradient */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </div>
    </section>
  );
}
