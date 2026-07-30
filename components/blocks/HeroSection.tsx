'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as motion from 'motion/react-client';
import { HeroContent } from '@/types/blocks';

export default function HeroSection({ content }: { content: HeroContent }) {
  return (
    <section className={`relative overflow-hidden bg-[#07111f] pt-32 ${content.compact ? 'pb-20 lg:pt-36' : 'pb-20 lg:pb-28 lg:pt-44'}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600/20 via-cyan-400/15 to-transparent blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="mb-7 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
            {content.eyebrow || 'Tecnologia para remuneração variável'}
          </p>

          <h1 className="mb-7 text-4xl font-extrabold leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {content.title}
          </h1>

          <p className="mb-10 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            {content.subtitle}
          </p>

          <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
            <Link href={content.primary_button_link || '/contato'} className="btn-premium w-full sm:w-auto">
              {content.primary_button}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
            {content.secondary_button && (
              <Link
                href={content.secondary_button_link || (content.secondary_button === 'Ver Artigos' ? '#artigos' : '/solucoes')}
                className="btn-premium-dark w-full sm:w-auto"
              >
                {content.secondary_button}
              </Link>
            )}
          </div>
        </div>

        {content.image_url && (
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            <div className="relative flex aspect-[16/9] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1422] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
              <div className="z-20 flex h-11 w-full shrink-0 items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4">
                <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
              </div>

              <div className="relative w-full flex-1">
                {content.image_link ? (
                  <a href={content.image_link} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
                    <Image
                      src={content.image_url}
                      alt={content.image_alt || 'Visão da plataforma AdvR'}
                      fill
                      className="object-cover"
                      priority
                      referrerPolicy="no-referrer"
                    />
                  </a>
                ) : (
                  <Image
                    src={content.image_url}
                    alt={content.image_alt || 'Visão da plataforma AdvR'}
                    fill
                    className="object-cover"
                    priority
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
