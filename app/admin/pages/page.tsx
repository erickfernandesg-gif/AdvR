import { getPageBlocks, getPageMetadata } from '@/lib/db';
import AdminPagesClient from '@/components/AdminPagesClient';

// Always load the latest CMS state instead of a build-time snapshot.
export const dynamic = 'force-dynamic';

export default async function AdminPages() {
  const slugs = ['/', '/empresa', '/solucoes', '/blog', '/contato', '/portal'];
  const pageResults = await Promise.all(
    slugs.map(async slug => ({
      blocks: (await getPageBlocks(slug)) || [],
      metadata: await getPageMetadata(slug),
    }))
  );

  const pagesData = [
    { title: 'Home - AdvR', slug: '/', ...pageResults[0] },
    { title: 'Empresa - AdvR', slug: '/empresa', ...pageResults[1] },
    { title: 'Soluções - AdvR', slug: '/solucoes', ...pageResults[2] },
    { title: 'Blog (Insights) - AdvR', slug: '/blog', ...pageResults[3] },
    { title: 'Contato - AdvR', slug: '/contato', ...pageResults[4] },
    { title: 'Portal de Incentivos', slug: '/portal', ...pageResults[5] },
  ];

  return <AdminPagesClient pagesData={pagesData} />;
}
