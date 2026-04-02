'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as motion from "motion/react-client";
import { HeroContent } from '@/types/blocks';

export default function HeroSection({ content }: { content: HeroContent }) {
  const title = content.title || '';
  const parts = title.split('.');

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0A0A0A]">
      {/* Deep Tech Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-neon blur-[100px] rounded-full mix-blend-screen"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Pill Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
          >
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">SLA de 24 Horas Garantido</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.1] tracking-tight mb-8"
          >
            {parts.map((part: string, i: number) => (
              <span key={i}>
                {i === 1 ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary drop-shadow-sm">
                    {part}
                  </span>
                ) : (
                  part
                )}
                {i < parts.length - 1 && '.'}
              </span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl font-light"
          >
            {content.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full sm:w-auto"
          >
            <Link href={content.primary_button_link || "/#contato"} className="btn-premium w-full sm:w-auto">
              {content.primary_button}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
            <Link href={content.secondary_button_link || (content.secondary_button === 'Ver Artigos' ? '#artigos' : "/solucoes")} className="btn-premium-dark w-full sm:w-auto">
              {content.secondary_button}
            </Link>
          </motion.div>
        </div>

        {/* Dashboard/Image Preview Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-20 relative mx-auto max-w-5xl animate-float"
        >
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#111] flex flex-col">
            {/* Mockup Header */}
            <div className="w-full h-12 shrink-0 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2 z-20 backdrop-blur-md">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            
            {/* Image Container */}
            <div className="relative flex-1 w-full">
              {content.image_link ? (
                <a href={content.image_link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <Image 
                    src={content.image_url} 
                    alt="Dashboard de Performance" 
                    fill
                    className="object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                    priority
                    referrerPolicy="no-referrer"
                  />
                </a>
              ) : (
                <Image 
                  src={content.image_url} 
                  alt="Dashboard de Performance" 
                  fill
                  className="object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                  priority
                  referrerPolicy="no-referrer"
                />
              )}
              
              {/* Overlay Gradient for depth (reduced opacity) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/20 via-transparent to-transparent z-10 pointer-events-none"></div>
            </div>
          </div>

          {/* Floating Stats Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            className="absolute -bottom-6 -left-6 bg-[#1A1A1A] p-6 rounded-2xl shadow-2xl border border-white/10 hidden md:block backdrop-blur-xl z-30"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                <span className="material-symbols-outlined text-accent">precision_manufacturing</span>
              </div>
              <div>
                <div className="text-3xl font-display font-black text-white">99.9%</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Precisão de Cálculo</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
