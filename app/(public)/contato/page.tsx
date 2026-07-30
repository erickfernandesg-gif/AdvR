import { getGlobalSettings, getPageBlocks } from '@/lib/db';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';
import { buildPageMetadata } from '@/lib/page-seo';

// Content is managed through the CMS and must reflect published updates.
export const dynamic = 'force-dynamic';

export const generateMetadata = () => buildPageMetadata('/contato', {
  title: 'Fale Conosco',
  description: 'Nossa equipe de especialistas está pronta para entender seus desafios e propor a melhor solução em engenharia de remuneração.',
});

export default async function Contato() {
  const [pageBlocks, settings] = await Promise.all([
    getPageBlocks('/contato'),
    getGlobalSettings(),
  ]);

  const blocks = pageBlocks.map(block => {
    if (block.block_name !== 'contact_section') return block;
    const content = block.content as Record<string, any>;

    return {
      ...block,
      content: {
        ...content,
        location: String(content.location || '').trim() || settings.address,
      },
    };
  });

  return (
    <main className="bg-white min-h-screen pb-24">
      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}
