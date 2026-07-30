import { getPageBlocks } from '@/lib/db';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';
import { buildPageMetadata } from '@/lib/page-seo';

// Content is managed through the CMS and must reflect published updates.
export const dynamic = 'force-dynamic';

export const generateMetadata = () => buildPageMetadata('/', {
  title: 'Home',
  description: 'A AdvR transforma modelos complexos em vantagem competitiva com tecnologia de ponta para Premiação de Vendas.',
});

export default async function Home() {
  const blocks = await getPageBlocks('/');

  return (
    <main className="bg-white min-h-screen">
      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}
