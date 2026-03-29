import { getLeads } from '@/lib/db';

export default async function AdminDashboard() {
  const leads = (await getLeads()) || [];
  const newLeadsCount = leads.filter((l: any) => l.status === 'novo').length;

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-foreground mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div>
              <h3 className="text-muted-foreground font-medium">Total de Leads</h3>
              <p className="text-3xl font-display font-bold text-foreground">{leads.length}</p>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
              <span className="material-symbols-outlined">fiber_new</span>
            </div>
            <div>
              <h3 className="text-muted-foreground font-medium">Novos Leads</h3>
              <p className="text-3xl font-display font-bold text-foreground">{newLeadsCount}</p>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div>
              <h3 className="text-muted-foreground font-medium">Páginas</h3>
              <p className="text-3xl font-display font-bold text-foreground">1</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-display font-bold text-foreground mb-6">Leads Recentes</h2>
      <div className="glass-panel rounded-2xl border border-white/10 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="p-4 font-bold text-muted-foreground">Nome</th>
              <th className="p-4 font-bold text-muted-foreground">Empresa</th>
              <th className="p-4 font-bold text-muted-foreground">Data</th>
              <th className="p-4 font-bold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.slice(0, 5).map((lead: any) => (
              <tr key={lead.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="p-4 text-foreground">{lead.nome}</td>
                <td className="p-4 text-muted-foreground">{lead.empresa}</td>
                <td className="p-4 text-muted-foreground">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${lead.status === 'novo' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/10 text-muted-foreground border border-white/20'}`}>
                    {lead.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">Nenhum lead encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
