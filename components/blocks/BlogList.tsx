'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPosts } from '@/lib/db';
import * as motion from 'motion/react-client';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  image_url?: string;
  created_at: string;
}

export default function BlogList({ content }: { content: any }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const data = await getPosts();
      setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-slate-100 h-96 rounded-[2rem]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-muted-foreground">Nenhum artigo encontrado no momento.</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-16">
        <h2 className="text-4xl font-display font-extrabold text-foreground tracking-tight mb-4">{content.title}</h2>
        <p className="text-muted-foreground font-light text-lg">{content.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
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
                  <span className="bg-secondary text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-border">
                    {post.category}
                  </span>
                  <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                    {new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-muted-foreground font-light line-clamp-3 mb-8 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all">
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
