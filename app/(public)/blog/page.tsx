import { getPageBlocks } from '@/lib/db';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';
import { buildPageMetadata } from '@/lib/page-seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const generateMetadata = () => buildPageMetadata('/blog', {
  title: 'Insights e Blog',
  description: 'Artigos, tendências e análises profundas sobre como otimizar a performance da sua equipe de vendas e engenharia de remuneração.',
});

export default async function Blog() {
  const blocks = await getPageBlocks('/blog');

  return (
    <main className="bg-white min-h-screen pb-24">
      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}
