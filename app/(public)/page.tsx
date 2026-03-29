import { getPageBlocks } from '@/lib/db';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';

export default async function Home() {
  const blocks = await getPageBlocks('/');

  return (
    <main className="bg-white min-h-screen">
      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}
