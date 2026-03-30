'use client';

import * as motion from "motion/react-client";
import { DataStorytellingContent } from '@/types/blocks';

export default function DataStorytelling({ content }: { content: DataStorytellingContent }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {content.stats?.map((stat, i: number) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="text-center p-12 bg-background rounded-[3rem] border border-border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-6xl lg:text-8xl font-display font-black text-primary mb-4 tracking-tighter">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </section>
  );
}
