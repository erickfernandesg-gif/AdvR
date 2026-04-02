import { getPageBlocks } from '@/lib/db';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Soluções e Motor Colossus',
  description: 'Conheça o Motor Colossus, nossa tecnologia proprietária desenhada para lidar com a complexidade da remuneração variável de grandes corporações.',
};

export default async function Solucoes() {
  const blocks = await getPageBlocks('/solucoes');

  return (
    <main className="bg-white min-h-screen pb-24">
      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}
