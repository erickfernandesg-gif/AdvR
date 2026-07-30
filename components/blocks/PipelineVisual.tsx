'use client';

import * as motion from "motion/react-client";
import { PipelineContent } from '@/types/blocks';

export default function PipelineVisual({ content }: { content: PipelineContent }) {
  return (
    <section id="processo" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <p className="section-eyebrow">Como funciona</p>
        <h2 className="section-title mt-4">{content.title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 hidden md:block -z-10 overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            whileInView={{ x: '100%' }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </div>
        {content.steps?.map((step, i: number) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glow-card bg-background p-8 rounded-3xl border border-border shadow-sm relative"
          >
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground mb-6 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">{step.icon}</span>
            </div>
            <div className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">Etapa {step.id}</div>
            <h3 className="text-xl font-display font-bold text-foreground mb-4">{step.title}</h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
