'use client';

import { useEffect, useState } from 'react';
import * as motion from 'motion/react-client';
import { supabase } from '@/lib/db';

interface Testimonial {
  id: string;
  nome: string;
  empresa?: string;
  texto: string;
  img_url?: string;
  created_at: string;
}

export default function Testimonials({ content }: { content: any }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('depoimentos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar depoimentos:', error);
        } else if (data && data.length > 0) {
          setTestimonials(data);
        }
      } catch (err) {
        console.error('Erro inesperado ao carregar depoimentos:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadTestimonials();
  }, []);

  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    {
      id: 'fallback-1',
      nome: 'Carlos Silva',
      empresa: 'Diretor de Vendas, TechCorp',
      texto: 'A implementação do Motor Colossus transformou completamente a forma como gerenciamos as comissões. A transparência e a precisão dos cálculos aumentaram a motivação da equipe de vendas em 40% no primeiro trimestre.',
      img_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
      created_at: new Date().toISOString()
    },
    {
      id: 'fallback-2',
      nome: 'Mariana Costa',
      empresa: 'CHRO, Global Retail',
      texto: 'A AdvR não entregou apenas um software, mas uma consultoria estratégica que redefiniu nossos modelos de incentivo. O suporte local e o profundo conhecimento técnico foram fundamentais para o sucesso do projeto.',
      img_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
      created_at: new Date().toISOString()
    },
    {
      id: 'fallback-3',
      nome: 'Roberto Almeida',
      empresa: 'CFO, Logistix Brasil',
      texto: 'A capacidade de auditar cada centavo pago em remuneração variável nos deu uma segurança jurídica e financeira sem precedentes. O sistema é robusto e perfeitamente adaptado à complexidade da nossa operação.',
      img_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
      created_at: new Date().toISOString()
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-extrabold text-foreground tracking-tight mb-6"
          >
            {content?.title || 'O que dizem nossos clientes'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg font-light"
          >
            {content?.subtitle || 'Histórias reais de empresas que transformaram sua gestão de remuneração variável com a AdvR.'}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full relative"
            >
              <div className="absolute top-8 right-8 text-primary/20">
                <span className="material-symbols-outlined text-6xl">format_quote</span>
              </div>
              
              <div className="flex-1 mb-8 relative z-10">
                <p className="text-muted-foreground font-light leading-relaxed text-lg italic">
                  &quot;{testimonial.texto}&quot;
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-auto relative z-10">
                {testimonial.img_url ? (
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20">
                    <img 
                      src={testimonial.img_url} 
                      alt={testimonial.nome} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/20">
                    {testimonial.nome.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-display font-bold text-foreground">{testimonial.nome}</h4>
                  {testimonial.empresa && (
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">{testimonial.empresa}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
