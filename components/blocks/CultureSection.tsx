'use client';

import * as motion from "motion/react-client";
import { CultureContent } from '@/types/blocks';

export default function CultureSection({ content }: { content: CultureContent }) {
  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-background border-2 border-primary/10 p-16 rounded-[4rem] text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-24 shadow-sm relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-display font-bold mb-8 tracking-tight text-foreground relative z-10"
      >
        {content.title}
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground font-light text-lg max-w-2xl mx-auto leading-relaxed mb-12 relative z-10"
      >
        {content.description}
      </motion.p>
      
      <div className="flex flex-wrap justify-center gap-4 relative z-10">
        {content.tags?.map((tag, i: number) => (
          <motion.span 
            key={i} 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-primary hover:text-background transition-colors cursor-default"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.section>
  );
}
