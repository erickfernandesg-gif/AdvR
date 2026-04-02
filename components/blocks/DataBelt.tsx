'use client';

import * as motion from "motion/react-client";
import { DataBeltContent } from '@/types/blocks';

export default function DataBelt({ content }: { content: DataBeltContent }) {
  return (
    <section className="py-24 bg-background border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-5xl font-display font-extrabold mb-16 text-center tracking-tight text-foreground">
          {content.title}
        </h2>
        
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-primary/20 -translate-y-1/2 hidden lg:block overflow-hidden">
            <motion.div 
              initial={{ x: '-100%' }}
              whileInView={{ x: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-1/3 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            {content.steps.map((step, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 bg-primary/10 text-primary border border-primary/20 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform group-hover:shadow-primary/20 group-hover:shadow-lg">
                  <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Passo 0{i + 1}</div>
                <p className="text-lg font-medium text-foreground">{step.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
