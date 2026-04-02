import { getPageBlocks } from '@/lib/db';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insights e Blog',
  description: 'Artigos, tendências e análises profundas sobre como otimizar a performance da sua equipe de vendas e engenharia de remuneração.',
};

export default async function Blog() {
  const blocks = await getPageBlocks('/blog');

  return (
    <main className="bg-white min-h-screen pb-24">
      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}
