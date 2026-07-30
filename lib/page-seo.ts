import { Metadata } from 'next';
import { getPageMetadata } from '@/lib/db';

export async function buildPageMetadata(
  slug: string,
  fallback: { title: string; description: string }
): Promise<Metadata> {
  const seo = await getPageMetadata(slug);
  const title = seo.meta_title || fallback.title;
  const description = seo.meta_description || fallback.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: seo.og_image_url ? [{ url: seo.og_image_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: seo.og_image_url ? [seo.og_image_url] : undefined,
    },
    robots: {
      index: !seo.no_index,
      follow: !seo.no_index,
    },
  };
}
