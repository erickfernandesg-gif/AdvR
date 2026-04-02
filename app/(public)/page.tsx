import { getPageBlocks } from '@/lib/db';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'A AdvR transforma modelos complexos em vantagem competitiva com tecnologia de ponta para Premiação de Vendas.',
};

export default async function Home() {
  const blocks = await getPageBlocks('/');

  return (
    <main className="bg-white min-h-screen">
      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}
