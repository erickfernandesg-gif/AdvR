import { getPageBlocks } from '@/lib/db';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nossa História',
  description: 'Há mais de uma década, a AdvR lidera a transformação digital na gestão de incentivos corporativos e remuneração variável.',
};

export default async function Empresa() {
  const blocks = await getPageBlocks('/empresa');

  return (
    <main className="bg-white min-h-screen pb-24">
      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}
