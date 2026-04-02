'use client';

import Link from 'next/link';
import { BlogHighlightContent } from '@/types/blocks';

export default function BlogHighlight({ content }: { content: any }) {
  // Handle both new format (content.post) and old format (content.posts[0])
  const post = content.post || (content.posts && content.posts.length > 0 ? content.posts[0] : null);
  if (!post) return null;

  const postLink = post.slug ? `/blog-detalhes/${post.slug}` : (post.link || '#');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-display font-extrabold text-foreground tracking-tight mb-4">{content.title}</h2>
          <p className="text-muted-foreground font-light text-lg">{content.subtitle}</p>
        </div>
        <Link href="/blog" className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:gap-4 transition-all">
          Ver Todos os Insights <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
      <Link href={postLink} className="group block">
        <div className="bg-background border-2 border-border p-12 rounded-[3rem] text-foreground relative overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row gap-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
          
          {post.image_url && (
            <div className="lg:w-1/3 relative h-64 lg:h-auto overflow-hidden rounded-2xl">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          
          <div className="relative z-10 lg:flex-1">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block mb-8">
              {post.category}
            </div>
            <h3 className="text-4xl lg:text-5xl font-display font-bold mb-8 group-hover:text-primary transition-colors leading-tight max-w-4xl">
              {post.title}
            </h3>
            <p className="text-muted-foreground text-xl font-light leading-relaxed max-w-2xl mb-12">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-primary font-bold uppercase tracking-widest text-sm group-hover:gap-6 transition-all">
              Explorar Insight <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
