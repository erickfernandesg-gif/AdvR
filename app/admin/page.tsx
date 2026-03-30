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
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        {loading && <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div>
              <h3 className="text-muted-foreground font-medium">Total de Leads</h3>
              <p className="text-3xl font-display font-bold text-foreground">{metrics.totalLeads}</p>
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
              <p className="text-3xl font-display font-bold text-foreground">{metrics.newLeads}</p>
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
              <p className="text-3xl font-display font-bold text-foreground">{metrics.pages}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center">
              <span className="material-symbols-outlined">widgets</span>
            </div>
            <div>
              <h3 className="text-muted-foreground font-medium">Total de Blocos</h3>
              <p className="text-3xl font-display font-bold text-foreground">{metrics.blocks}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-display font-bold text-foreground mb-6">Leads Recentes</h2>
      <div className="glass-panel rounded-2xl border border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
              {!loading && leads.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">Nenhum lead encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
