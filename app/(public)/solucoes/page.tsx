import { getPageBlocks } from '@/lib/db';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';

export default async function Solucoes() {
  const blocks = await getPageBlocks('/solucoes');

  return (
    <main className="bg-white min-h-screen pt-32 pb-24">
      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}
