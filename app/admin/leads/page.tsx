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
  const [dateFilter, setDateFilter] = useState('todos');
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
    
    let matchesDate = true;
    if (dateFilter !== 'todos') {
      const leadDate = new Date(lead.created_at);
      const now = new Date();
      if (dateFilter === '7d') {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        matchesDate = leadDate >= sevenDaysAgo;
      } else if (dateFilter === '30d') {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        matchesDate = leadDate >= thirtyDaysAgo;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Leads</h1>
        <div className="flex gap-4">
          <ExportCsvButton leads={filteredLeads} />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="Buscar leads..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400" 
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
            >
              <option value="todos">Todos os Status</option>
              <option value="novo">Novo</option>
              <option value="em_atendimento">Em Atendimento</option>
              <option value="convertido">Convertido</option>
              <option value="perdido">Perdido</option>
            </select>
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full md:w-auto bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
            >
              <option value="todos">Qualquer Data</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
            </select>
          </div>
          {loading && <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-widest">Nome / Empresa</th>
                <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-widest">Contato</th>
                <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-widest">Data</th>
                <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-widest">Status</th>
                <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead: any) => (
                <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                  <td className="p-5">
                    <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{lead.nome}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {lead.empresa} {lead.cargo ? `• ${lead.cargo}` : ''}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="text-sm text-slate-900">{lead.email}</div>
                    {lead.telefone && <div className="text-xs text-slate-500 mt-0.5">{lead.telefone}</div>}
                  </td>
                  <td className="p-5 text-sm text-slate-500">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-5">
                    <LeadStatusSelect leadId={lead.id} initialStatus={lead.status} />
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 text-slate-400 hover:text-primary transition-all rounded-lg hover:bg-blue-50"
                        title="Ver detalhes"
                      >
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                      <button 
                        onClick={() => setLeadToDelete(lead.id)}
                        disabled={isDeleting === lead.id}
                        className="p-2 text-slate-400 hover:text-red-600 transition-all rounded-lg hover:bg-red-50 disabled:opacity-50"
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
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                      <span className="material-symbols-outlined text-5xl opacity-50">person_search</span>
                      <p className="text-lg text-slate-500">Nenhum lead encontrado.</p>
                      <button 
                        onClick={() => {setSearchTerm(''); setStatusFilter('todos'); setDateFilter('todos');}}
                        className="text-primary hover:underline text-sm font-medium"
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-8"
            >
              <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Confirmar Exclusão</h3>
              <p className="text-slate-600 mb-8">
                Tem certeza que deseja excluir este lead? Esta ação é irreversível e removerá todos os dados permanentemente.
              </p>
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setLeadToDelete(null)}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDelete(leadToDelete)}
                  disabled={isDeleting === leadToDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-display font-bold text-slate-900">{selectedLead.nome}</h2>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      selectedLead.status === 'novo' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      selectedLead.status === 'em_atendimento' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      selectedLead.status === 'convertido' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {selectedLead.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-600">{selectedLead.empresa} {selectedLead.cargo ? `• ${selectedLead.cargo}` : ''}</p>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">E-mail</label>
                    <p className="text-slate-900">{selectedLead.email}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">Telefone</label>
                    <p className="text-slate-900">{selectedLead.telefone || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">Data de Cadastro</label>
                    <p className="text-slate-900">{new Date(selectedLead.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">Mensagem / Observações</label>
                    <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 min-h-[100px]">
                      {selectedLead.mensagem || 'Nenhuma mensagem enviada.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  Fechar
                </button>
                <a 
                  href={`mailto:${selectedLead.email}`}
                  className="bg-primary text-white hover:bg-blue-700 !py-2.5 !px-8 rounded-full text-sm uppercase tracking-widest font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center"
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
