'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/db';
import * as motion from 'motion/react-client';

interface Post {
  id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  slug: string;
  image_url?: string;
  created_at: string;
}

export default function BlogList({ content }: { content: any }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        if (!supabase) {
          console.warn('Supabase client not initialized');
          setLoading(false);
          return;
        }

        // Fetch direto na tabela posts ordenando pelos mais recentes
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, excerpt, content, category, slug, image_url, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar posts no Supabase:', error);
        } else if (data) {
          setPosts(data);
        }
      } catch (err) {
        console.error('Erro inesperado ao carregar posts:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div id="artigos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-slate-100 h-96 rounded-[2rem]"></div>
          ))}
        </div>
      </div>
    );
  }

  const displayPosts = posts.length > 0 ? posts : [
    {
      id: 'fallback-1',
      title: 'A Gestão Proativa na Remuneração Variável: Antecipando Desafios para Otimizar Resultados',
      excerpt: 'No dinâmico cenário empresarial atual, a capacidade de antecipar é um diferencial competitivo crucial. Isso se aplica intensamente à gestão da remuneração variável.',
      category: 'Suporte Proativo',
      slug: 'suporte-proativo',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      created_at: new Date().toISOString()
    },
    {
      id: 'fallback-2',
      title: 'O Impacto da Inteligência Artificial na Engenharia de Remuneração',
      excerpt: 'Descubra como algoritmos preditivos estão transformando a maneira como as empresas estruturam seus pacotes de incentivos.',
      category: 'Tecnologia',
      slug: 'ia-remuneracao',
      image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'fallback-3',
      title: 'Transparência Radical: O Novo Padrão para Engajamento de Vendas',
      excerpt: 'Por que esconder as regras do jogo está custando caro para sua empresa e como a transparência pode aumentar as vendas em até 30%.',
      category: 'Engajamento',
      slug: 'transparencia-radical',
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ];

  return (
    <section id="artigos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-16">
        <h2 className="text-4xl font-display font-extrabold text-foreground tracking-tight mb-4">
          {content?.title || 'Todos os Insights'}
        </h2>
        <p className="text-muted-foreground font-light text-lg">
          {content?.subtitle || 'Acesse nossa biblioteca completa de conhecimento.'}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Link href={`/blog-detalhes/${post.slug}`} className="group block h-full">
              <div className="bg-white border border-border p-8 rounded-[2rem] h-full flex flex-col hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                {post.image_url && (
                  <div className="relative h-48 w-full mb-8 overflow-hidden rounded-2xl">
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 mb-6">
                  {(post.category || post.subtitle) && (
                    <span className="bg-secondary text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-border">
                      {post.category || 'Artigo'}
                    </span>
                  )}
                  <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                    {new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-muted-foreground font-light line-clamp-3 mb-8 flex-1">
                  {post.excerpt || post.subtitle}
                </p>
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all mt-auto">
                  Ler Insight <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
