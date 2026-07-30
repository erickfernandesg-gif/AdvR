'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';

type PreviewPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  image_url?: string;
};

export default function BlogPreview({ content }: { content: any }) {
  const [posts, setPosts] = useState<PreviewPost[]>([]);

  useEffect(() => {
    if (!supabase) return;

    supabase
      .from('posts')
      .select('id, slug, title, excerpt, category, image_url')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        if (!error && data) setPosts(data);
      });
  }, []);

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="section-eyebrow">{content.eyebrow || 'Conteúdos e novidades'}</p>
            <h2 className="section-title mt-4">{content.title}</h2>
            <p className="section-copy mt-5">{content.subtitle}</p>
          </div>
          <Link href="/blog" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-500">
            {content.button_text}
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        {posts.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog-detalhes/${post.slug}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-950/5"
              >
                {post.image_url && (
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={post.image_url}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.category && (
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{post.category}</p>
                  )}
                  <h3 className="mt-3 text-xl font-bold leading-snug text-slate-950 group-hover:text-blue-600">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
