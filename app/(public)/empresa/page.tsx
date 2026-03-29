import { getPageBlocks } from '@/lib/db';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';

export default async function Empresa() {
  const blocks = await getPageBlocks('/empresa');

  return (
    <main className="bg-white min-h-screen pt-32 pb-24">
      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}
