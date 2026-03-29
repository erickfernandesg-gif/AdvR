import { getLeads } from '@/lib/db';
import ExportCsvButton from '@/components/ExportCsvButton';
import LeadStatusSelect from '@/components/LeadStatusSelect';

export default async function AdminLeads() {
  const leads = (await getLeads()) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Leads</h1>
        <div className="flex gap-4">
          <ExportCsvButton leads={leads} />
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">search</span>
              <input type="text" placeholder="Buscar leads..." className="pl-10 pr-4 py-2 rounded-full bg-black/40 border border-white/10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64 placeholder:text-muted-foreground" />
            </div>
            <select className="bg-black/40 border border-white/10 rounded-full px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="todos">Todos os Status</option>
              <option value="novo">Novo</option>
              <option value="em_atendimento">Em Atendimento</option>
              <option value="convertido">Convertido</option>
              <option value="perdido">Perdido</option>
            </select>
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/10">
              <th className="p-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Nome / Empresa</th>
              <th className="p-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Contato</th>
              <th className="p-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Data</th>
              <th className="p-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Status</th>
              <th className="p-4 font-bold text-muted-foreground text-sm uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead: any) => (
              <tr key={lead.id} className="border-b border-white/10 hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-foreground">{lead.nome}</div>
                  <div className="text-sm text-muted-foreground">{lead.empresa} - {lead.cargo}</div>
                </td>
                <td className="p-4">
                  <div className="text-foreground">{lead.email}</div>
                </td>
                <td className="p-4 text-muted-foreground">
                  {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4">
                  <LeadStatusSelect leadId={lead.id} initialStatus={lead.status} />
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum lead encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
