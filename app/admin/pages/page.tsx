import { getPageBlocks } from '@/lib/db';
import AdminPagesClient from '@/components/AdminPagesClient';

export default async function AdminPages() {
  const homeBlocks = (await getPageBlocks('/')) || [];
  const empresaBlocks = (await getPageBlocks('/empresa')) || [];
  const solucoesBlocks = (await getPageBlocks('/solucoes')) || [];
  const blogBlocks = (await getPageBlocks('/blog')) || [];
  const contatoBlocks = (await getPageBlocks('/contato')) || [];

  const pagesData = [
    { title: 'Home - AdvR', slug: '/', blocks: homeBlocks },
    { title: 'Empresa - AdvR', slug: '/empresa', blocks: empresaBlocks },
    { title: 'Soluções - AdvR', slug: '/solucoes', blocks: solucoesBlocks },
    { title: 'Blog (Insights) - AdvR', slug: '/blog', blocks: blogBlocks },
    { title: 'Contato - AdvR', slug: '/contato', blocks: contatoBlocks },
  ];

  return <AdminPagesClient pagesData={pagesData} />;
}
