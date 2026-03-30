'use client';

import { useEffect, useState } from 'react';
import { getLeads, supabase } from '@/lib/db';
import ExportCsvButton from '@/components/ExportCsvButton';
import LeadStatusSelect from '@/components/LeadStatusSelect';

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const fetchLeads = async () => {
    setLoading(true);
    const data = await getLeads();
    setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeads();

    // Set up real-time subscription
    if (supabase) {
      const channel = supabase
        .channel('leads-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
          fetchLeads();
        })
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, []);

  const filteredLeads = leads.filter((lead: any) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      (lead.nome && lead.nome.toLowerCase().includes(searchLower)) || 
      (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
      (lead.empresa && lead.empresa.toLowerCase().includes(searchLower));
    
    const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
              <input 
                type="text" 
                placeholder="Buscar leads..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-black/40 border border-white/10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64 placeholder:text-muted-foreground" 
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-full px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="todos">Todos os Status</option>
              <option value="novo">Novo</option>
              <option value="em_atendimento">Em Atendimento</option>
              <option value="convertido">Convertido</option>
              <option value="perdido">Perdido</option>
            </select>
          </div>
          {loading && <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>}
        </div>
        
        <div className="overflow-x-auto">
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
              {filteredLeads.map((lead: any) => (
                <tr key={lead.id} className="border-b border-white/10 hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-foreground">{lead.nome}</div>
                    <div className="text-sm text-muted-foreground">
                      {lead.empresa} {lead.cargo ? `- ${lead.cargo}` : ''}
                    </div>
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
              {!loading && filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum lead encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
