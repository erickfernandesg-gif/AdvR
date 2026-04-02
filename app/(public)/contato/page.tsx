import { getPageBlocks } from '@/lib/db';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fale Conosco',
  description: 'Nossa equipe de especialistas está pronta para entender seus desafios e propor a melhor solução em engenharia de remuneração.',
};

export default async function Contato() {
  const blocks = await getPageBlocks('/contato');

  return (
    <main className="bg-white min-h-screen pb-24">
      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}
