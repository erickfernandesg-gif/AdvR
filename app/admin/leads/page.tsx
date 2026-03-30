'use client';

import { useEffect, useState } from 'react';
import { getLeads, supabase, deleteLead } from '@/lib/db';
import ExportCsvButton from '@/components/ExportCsvButton';
import LeadStatusSelect from '@/components/LeadStatusSelect';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    const data = await getLeads();
    setLeads(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const success = await deleteLead(id);
    if (success) {
      setLeads(prev => prev.filter(l => l.id !== id));
      setLeadToDelete(null);
    } else {
      // Show error in UI instead of alert
      console.error('Erro ao excluir lead.');
    }
    setIsDeleting(null);
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
        <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">search</span>
              <input 
                type="text" 
                placeholder="Buscar leads..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50" 
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
            >
              <option value="todos" className="bg-slate-900">Todos os Status</option>
              <option value="novo" className="bg-slate-900">Novo</option>
              <option value="em_atendimento" className="bg-slate-900">Em Atendimento</option>
              <option value="convertido" className="bg-slate-900">Convertido</option>
              <option value="perdido" className="bg-slate-900">Perdido</option>
            </select>
          </div>
          {loading && <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-5 font-bold text-muted-foreground text-xs uppercase tracking-widest">Nome / Empresa</th>
                <th className="p-5 font-bold text-muted-foreground text-xs uppercase tracking-widest">Contato</th>
                <th className="p-5 font-bold text-muted-foreground text-xs uppercase tracking-widest">Data</th>
                <th className="p-5 font-bold text-muted-foreground text-xs uppercase tracking-widest">Status</th>
                <th className="p-5 font-bold text-muted-foreground text-xs uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead: any) => (
                <tr key={lead.id} className="border-b border-white/10 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5">
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">{lead.nome}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {lead.empresa} {lead.cargo ? `• ${lead.cargo}` : ''}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="text-sm text-foreground">{lead.email}</div>
                    {lead.telefone && <div className="text-xs text-muted-foreground mt-0.5">{lead.telefone}</div>}
                  </td>
                  <td className="p-5 text-sm text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-5">
                    <LeadStatusSelect leadId={lead.id} initialStatus={lead.status} />
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 text-muted-foreground hover:text-primary transition-all rounded-lg hover:bg-white/5"
                        title="Ver detalhes"
                      >
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                      <button 
                        onClick={() => setLeadToDelete(lead.id)}
                        disabled={isDeleting === lead.id}
                        className="p-2 text-muted-foreground hover:text-red-500 transition-all rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                        title="Excluir lead"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {isDeleting === lead.id ? 'progress_activity' : 'delete'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                      <span className="material-symbols-outlined text-5xl opacity-20">person_search</span>
                      <p className="text-lg">Nenhum lead encontrado.</p>
                      <button 
                        onClick={() => {setSearchTerm(''); setStatusFilter('todos');}}
                        className="text-primary hover:underline text-sm"
                      >
                        Limpar filtros
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {leadToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLeadToDelete(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass-panel rounded-3xl border border-white/10 shadow-2xl p-8"
            >
              <h3 className="text-xl font-display font-bold text-foreground mb-4">Confirmar Exclusão</h3>
              <p className="text-muted-foreground mb-8">
                Tem certeza que deseja excluir este lead? Esta ação é irreversível e removerá todos os dados permanentemente.
              </p>
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setLeadToDelete(null)}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDelete(leadToDelete)}
                  disabled={isDeleting === leadToDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isDeleting === leadToDelete ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                      Excluindo...
                    </>
                  ) : (
                    'Excluir Permanentemente'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass-panel rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-display font-bold text-foreground">{selectedLead.nome}</h2>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      selectedLead.status === 'novo' ? 'bg-green-500/20 text-green-400' :
                      selectedLead.status === 'em_atendimento' ? 'bg-accent/20 text-accent' :
                      selectedLead.status === 'convertido' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-white/10 text-muted-foreground'
                    }`}>
                      {selectedLead.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{selectedLead.empresa} {selectedLead.cargo ? `• ${selectedLead.cargo}` : ''}</p>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/5"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block mb-1">E-mail</label>
                    <p className="text-foreground">{selectedLead.email}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block mb-1">Telefone</label>
                    <p className="text-foreground">{selectedLead.telefone || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block mb-1">Data de Cadastro</label>
                    <p className="text-foreground">{new Date(selectedLead.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block mb-1">Mensagem / Observações</label>
                    <p className="text-foreground text-sm leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5 min-h-[100px]">
                      {selectedLead.mensagem || 'Nenhuma mensagem enviada.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/5 border-t border-white/10 flex justify-end gap-4">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Fechar
                </button>
                <a 
                  href={`mailto:${selectedLead.email}`}
                  className="btn-electric !py-2.5 !px-8 text-sm uppercase tracking-widest"
                >
                  Responder via E-mail
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
