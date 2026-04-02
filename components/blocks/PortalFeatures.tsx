'use client';

import * as motion from "motion/react-client";
import Image from 'next/image';
import { PortalFeaturesContent } from '@/types/blocks';

export default function PortalFeatures({ content }: { content: PortalFeaturesContent }) {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-extrabold text-foreground tracking-tight mb-6"
          >
            {content.title}
          </motion.h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="space-y-32">
          {content.features.map((feature, index) => {
            const isEven = index % 2 === 0;
            const hasImage = !!feature.image_url && feature.image_url.trim() !== '';

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}
              >
                {/* Text Content */}
                <div className="flex-1 space-y-6">
                  <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                    Recurso {index + 1}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xl text-muted-foreground font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Image Content */}
                <div className="flex-1 w-full">
                  {hasImage ? (
                    <div className="relative aspect-video lg:aspect-square rounded-[3rem] overflow-hidden border-8 border-secondary shadow-2xl group">
                      <Image
                        src={feature.image_url!}
                        alt={feature.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  ) : (
                    <div className="aspect-video lg:aspect-square rounded-[3rem] bg-secondary flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border group hover:border-primary/30 transition-colors">
                      <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-4xl">
                          {feature.title === 'Conteúdos' ? 'folder_open' : 
                           feature.title === 'Políticas' ? 'policy' : 
                           feature.title === 'Simulador' ? 'calculate' : 
                           feature.title === 'Análise BI' ? 'analytics' : 'extension'}
                        </span>
                      </div>
                      <h4 className="text-xl font-display font-bold text-foreground mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground font-light">Interface otimizada para máxima produtividade</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
