'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as motion from "motion/react-client";
import { HeroContent } from '@/types/blocks';

export default function HeroSection({ content }: { content: HeroContent }) {
  const title = content.title || '';
  const parts = title.split('.');

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(45%_45%_at_50%_50%,rgba(37,99,235,0.03)_0%,transparent_100%)] -z-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">SLA de 24 Horas Garantido</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-foreground leading-[1.1] tracking-tight mb-8">
              {parts.map((part: string, i: number) => (
                <span key={i}>
                  {i === 1 ? <span className="text-primary">{part}</span> : part}
                  {i < parts.length - 1 && '.'}
                </span>
              ))}
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl font-light">
              {content.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/#contato" className="btn-electric text-lg group">
                {content.primary_button}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link href="/solucoes" className="bg-background text-foreground border-2 border-border px-8 py-4 rounded-full font-bold text-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center">
                {content.secondary_button}
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-border">
              <Image 
                src={content.image_url} 
                alt="Dashboard de Performance" 
                fill
                className="object-cover"
                priority
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background p-6 rounded-2xl shadow-xl border border-border hidden md:block">
              <div className="text-3xl font-display font-black text-primary">99.9%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Precisão de Cálculo</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
