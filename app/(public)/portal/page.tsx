import { getPageBlocks } from '@/lib/db';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';
import { Metadata } from 'next';

// Content is managed through the CMS and must reflect published updates.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Portal de Incentivos | AdvR',
  description: 'Plataforma Inteligente e Atendimento Dedicado para sua força de vendas.',
};

export default async function Portal() {
  const blocks = await getPageBlocks('/portal');

  return (
    <main className="bg-white min-h-screen pb-24">
      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}
