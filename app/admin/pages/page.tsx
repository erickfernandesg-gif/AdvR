import { getPageBlocks } from '@/lib/db';
import AdminPageEditor from '@/components/AdminPageEditor';

export default async function AdminPages() {
  const homeBlocks = (await getPageBlocks('/')) || [];
  const empresaBlocks = (await getPageBlocks('/empresa')) || [];
  const solucoesBlocks = (await getPageBlocks('/solucoes')) || [];
  const blogBlocks = (await getPageBlocks('/blog')) || [];
  const contatoBlocks = (await getPageBlocks('/contato')) || [];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-extrabold text-foreground tracking-tight text-gradient-electric">Páginas (CMS)</h1>
          <p className="text-muted-foreground font-light">Gerencie o conteúdo estratégico do site AdvR.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Home */}
        <div className="bento-card !p-0 overflow-hidden">
          <div className="p-8 border-b border-border bg-secondary/50 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Home - AdvR</h2>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Slug: /</p>
            </div>
          </div>
          <div className="p-8">
            <AdminPageEditor initialBlocks={homeBlocks} />
          </div>
        </div>

        {/* Empresa */}
        <div className="bento-card !p-0 overflow-hidden">
          <div className="p-8 border-b border-border bg-secondary/50 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Empresa - AdvR</h2>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Slug: /empresa</p>
            </div>
          </div>
          <div className="p-8">
            <AdminPageEditor initialBlocks={empresaBlocks} />
          </div>
        </div>

        {/* Solucoes */}
        <div className="bento-card !p-0 overflow-hidden">
          <div className="p-8 border-b border-border bg-secondary/50 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Soluções - AdvR</h2>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Slug: /solucoes</p>
            </div>
          </div>
          <div className="p-8">
            <AdminPageEditor initialBlocks={solucoesBlocks} />
          </div>
        </div>

        {/* Blog */}
        <div className="bento-card !p-0 overflow-hidden">
          <div className="p-8 border-b border-border bg-secondary/50 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Blog (Insights) - AdvR</h2>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Slug: /blog</p>
            </div>
          </div>
          <div className="p-8">
            <AdminPageEditor initialBlocks={blogBlocks} />
          </div>
        </div>

        {/* Contato */}
        <div className="bento-card !p-0 overflow-hidden">
          <div className="p-8 border-b border-border bg-secondary/50 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Contato - AdvR</h2>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Slug: /contato</p>
            </div>
          </div>
          <div className="p-8">
            <AdminPageEditor initialBlocks={contatoBlocks} />
          </div>
        </div>
      </div>
    </div>
  );
}
