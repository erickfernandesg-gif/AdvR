'use client';

import { useEffect, useState } from 'react';
import { getLeads, getLeadsCount, getNewLeadsCount, getPagesCount, getBlocksCount, supabase } from '@/lib/db';

export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    newLeads: 0,
    pages: 0,
    blocks: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    const [leadsData, totalCount, newCount, pCount, bCount] = await Promise.all([
      getLeads(),
      getLeadsCount(),
      getNewLeadsCount(),
      getPagesCount(),
      getBlocksCount()
    ]);

    setLeads(leadsData || []);
    setMetrics({
      totalLeads: totalCount,
      newLeads: newCount,
      pages: pCount,
      blocks: bCount
    });
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();

    // Set up real-time subscription for leads to keep dashboard updated
    if (supabase) {
      const channel = supabase
        .channel('dashboard-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
          fetchDashboardData();
        })
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Dashboard</h1>
        {loading && <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total de Leads</h3>
              <p className="text-3xl font-display font-bold text-slate-900">{metrics.totalLeads}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined">fiber_new</span>
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Novos Leads</h3>
              <p className="text-3xl font-display font-bold text-slate-900">{metrics.newLeads}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Páginas</h3>
              <p className="text-3xl font-display font-bold text-slate-900">{metrics.pages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <span className="material-symbols-outlined">widgets</span>
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total de Blocos</h3>
              <p className="text-3xl font-display font-bold text-slate-900">{metrics.blocks}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-slate-900">Leads Recentes</h2>
        <a href="/admin/leads" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Ver todos <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Nome</th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Empresa</th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Data</th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 5).map((lead: any) => (
                <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{lead.nome}</td>
                  <td className="p-4 text-slate-600">{lead.empresa || '-'}</td>
                  <td className="p-4 text-slate-500 text-sm">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      lead.status === 'novo' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                      lead.status === 'em_atendimento' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      lead.status === 'convertido' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && leads.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">Nenhum lead encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
