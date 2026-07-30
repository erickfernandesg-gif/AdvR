import { getPageBlocks } from '@/lib/db';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';
import { buildPageMetadata } from '@/lib/page-seo';

// Content is managed through the CMS and must reflect published updates.
export const dynamic = 'force-dynamic';

export const generateMetadata = () => buildPageMetadata('/solucoes', {
  title: 'Soluções e Motor Colossus',
  description: 'Conheça o Motor Colossus, nossa tecnologia proprietária desenhada para lidar com a complexidade da remuneração variável de grandes corporações.',
});

export default async function Solucoes() {
  const blocks = await getPageBlocks('/solucoes');

  return (
    <main className="bg-white min-h-screen pb-24">
      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}
