'use client';

import Link from 'next/link';
import * as motion from "motion/react-client";
import { BentoContent } from '@/types/blocks';

export default function SolucoesBento({ content }: { content: BentoContent }) {
  return (
    <section id="solucoes" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-foreground mb-4 tracking-tight">{content.title}</h2>
          <p className="text-muted-foreground font-light text-lg">{content.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.cards?.map((card, i: number) => (
            <motion.div 
              key={card.id}
              whileHover={{ y: -5 }}
              className={`${i === 0 || i === 3 ? 'md:col-span-2' : ''} ${i === 1 ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : i === 2 ? 'bg-background border-primary/20 border-2' : 'bg-background border border-border shadow-sm'} p-8 rounded-[2.5rem] flex flex-col justify-between group`}
            >
              <div>
                <div className={`w-12 h-12 ${i === 1 ? 'bg-white/20' : 'bg-primary/10 text-primary'} rounded-2xl flex items-center justify-center mb-6`}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <h3 className={`text-2xl font-display font-bold mb-4 ${i === 0 || i === 3 ? 'text-3xl' : ''} ${i === 1 ? 'text-primary-foreground' : 'text-foreground'}`}>{card.title}</h3>
                <p className={`${i === 1 ? 'text-primary-foreground/80' : 'text-muted-foreground'} leading-relaxed font-light mb-8 max-w-md`}>
                  {card.description}
                </p>
              </div>
              <Link href="/solucoes" className={`${i === 1 ? 'text-primary-foreground' : 'text-primary'} font-bold flex items-center gap-2 group-hover:gap-3 transition-all`}>
                Explorar Tecnologia <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
