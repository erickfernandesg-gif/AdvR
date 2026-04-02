'use client';

import * as motion from "motion/react-client";
import LeadForm from '../LeadForm';
import { ContactContent } from '@/types/blocks';

export default function ContactSection({ content }: { content: ContactContent }) {
  const title = content.title || '';
  const parts = title.split('.');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5"
        >
          <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-foreground mb-8 tracking-tight">
            {parts.map((part: string, i: number) => (
              <span key={i} className={i === 1 ? 'text-primary' : ''}>{part}{i === 0 && parts.length > 1 ? '.' : ''}</span>
            ))}
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed mb-12">
            {content.subtitle}
          </p>
          
          <div className="space-y-8">
            <div className="glow-card flex items-center gap-6 p-6 bg-secondary rounded-3xl border border-border">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">E-mail Corporativo</div>
                <div className="text-lg font-bold text-foreground">{content.email}</div>
              </div>
            </div>
            <div className="glow-card flex items-center gap-6 p-6 bg-secondary rounded-3xl border border-border">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Sede Corporativa</div>
                <div className="text-lg font-bold text-foreground">{content.location}</div>
              </div>
            </div>
            {content.phone && (
              <div className="glow-card flex items-center gap-6 p-6 bg-secondary rounded-3xl border border-border">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined">phone</span>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Telefone</div>
                  <div className="text-lg font-bold text-foreground">{content.phone}</div>
                </div>
              </div>
            )}
            {content.whatsapp && (
              <div className="glow-card flex items-center gap-6 p-6 bg-secondary rounded-3xl border border-border">
                <div className="w-12 h-12 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20">
                  <span className="material-symbols-outlined">chat</span>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">WhatsApp</div>
                  <div className="text-lg font-bold text-foreground">
                    <a href={`https://api.whatsapp.com/send?phone=${content.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {content.whatsapp}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-7"
        >
          <div className="glow-card bg-background p-10 rounded-[3rem] border border-border shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">{content.form_title}</h2>
            <LeadForm buttonText={content.form_button} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
