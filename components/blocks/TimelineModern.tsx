'use client';

import * as motion from "motion/react-client";
import { TimelineContent } from '@/types/blocks';

export default function TimelineModern({ content }: { content: TimelineContent }) {
  return (
    <section className="py-24 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-display font-bold text-foreground mb-16 text-center uppercase tracking-widest">{content.title}</h2>
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 hidden md:block overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            whileInView={{ x: '100%' }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-1/3 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {content.milestones?.map((item, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative z-10"
            >
              <div className="w-4 h-4 bg-primary rounded-full mx-auto mb-6 border-4 border-background shadow-lg hidden md:block"></div>
              <div className="text-center">
                <div className="text-2xl font-display font-black text-foreground mb-2">{item.year}</div>
                <h3 className="text-lg font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
