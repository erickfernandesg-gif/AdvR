'use client';

import { useEffect, useState, useMemo } from 'react';
import { getLeads, getPagesCount, getBlocksCount, supabase } from '@/lib/db';
import ExportCsvButton from '@/components/ExportCsvButton';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { format, subDays, startOfDay, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [pagesCount, setPagesCount] = useState(0);
  const [blocksCount, setBlocksCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    const [leadsData, pCount, bCount] = await Promise.all([
      getLeads(),
      getPagesCount(),
      getBlocksCount()
    ]);

    setLeads(leadsData || []);
    setPagesCount(pCount);
    setBlocksCount(bCount);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();

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

  // Analytics Calculations
  const stats = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === 'novo').length;
    const converted = leads.filter(l => l.status === 'convertido').length;
    const inProgress = leads.filter(l => l.status === 'em_atendimento').length;
    const lost = leads.filter(l => l.status === 'perdido').length;
    
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0';

    // Leads by status for Pie Chart
    const statusData = [
      { name: 'Novo', value: newLeads, color: '#10b981' },
      { name: 'Em Atendimento', value: inProgress, color: '#3b82f6' },
      { name: 'Convertido', value: converted, color: '#8b5cf6' },
      { name: 'Perdido', value: lost, color: '#ef4444' },
    ].filter(s => s.value > 0);

    // Leads over last 15 days for Area Chart
    const last15Days = Array.from({ length: 15 }).map((_, i) => {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = leads.filter(l => format(parseISO(l.created_at), 'yyyy-MM-dd') === dateStr).length;
      return {
        date: format(date, 'dd/MM', { locale: ptBR }),
        count,
        fullDate: dateStr
      };
    }).reverse();

    // Top Companies
    const companyCounts: Record<string, number> = {};
    leads.forEach(l => {
      if (l.empresa) {
        const name = l.empresa.trim().toUpperCase();
        companyCounts[name] = (companyCounts[name] || 0) + 1;
      }
    });
    const topCompanies = Object.entries(companyCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total,
      newLeads,
      converted,
      conversionRate,
      statusData,
      last15Days,
      topCompanies
    };
  }, [leads]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Dashboard de Performance</h1>
          <p className="text-slate-500 mt-1">Visão geral da sua operação de leads e conteúdo.</p>
        </div>
        <div className="flex items-center gap-4">
          {loading && <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>}
          <ExportCsvButton leads={leads} />
          <button 
            onClick={fetchDashboardData}
            className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-100"
            title="Atualizar dados"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>
      
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total de Leads</h3>
              <p className="text-3xl font-display font-black text-slate-900">{stats.total}</p>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-medium">Histórico acumulado</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Taxa de Conversão</h3>
              <p className="text-3xl font-display font-black text-slate-900">{stats.conversionRate}%</p>
            </div>
          </div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            {stats.converted} leads convertidos
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Páginas Ativas</h3>
              <p className="text-3xl font-display font-black text-slate-900">{pagesCount}</p>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-medium">{blocksCount} blocos de conteúdo</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined">notifications_active</span>
            </div>
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Aguardando</h3>
              <p className="text-3xl font-display font-black text-slate-900">{stats.newLeads}</p>
            </div>
          </div>
          <div className="text-xs text-orange-600 font-bold">Leads com status &quot;Novo&quot;</div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leads Over Time */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-8">Volume de Leads (Últimos 15 dias)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.last15Days}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Leads"
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-8">Distribuição por Status</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            {stats.total === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                Sem dados suficientes
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Companies & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Companies */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-8">Top Empresas (Volume de Leads)</h3>
          <div className="space-y-4">
            {stats.topCompanies.map((company, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary font-bold">
                    {i + 1}
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-primary transition-colors">{company.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-display font-black text-slate-900">{company.count}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Leads</span>
                </div>
              </div>
            ))}
            {stats.topCompanies.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                Aguardando primeiros leads...
              </div>
            )}
          </div>
        </div>

        {/* Conversion Stats */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-8">Funil de Conversão</h3>
          <div className="space-y-6">
            {[
              { label: 'Novos', value: stats.newLeads, color: 'bg-emerald-500', total: stats.total },
              { label: 'Em Atendimento', value: leads.filter(l => l.status === 'em_atendimento').length, color: 'bg-blue-500', total: stats.total },
              { label: 'Convertidos', value: stats.converted, color: 'bg-purple-500', total: stats.total },
              { label: 'Perdidos', value: leads.filter(l => l.status === 'perdido').length, color: 'bg-red-500', total: stats.total },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="text-slate-900">{item.value} ({item.total > 0 ? ((item.value / item.total) * 100).toFixed(0) : 0}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-display font-bold text-slate-900">Leads Recentes</h2>
          <a href="/admin/leads" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group">
            Gerenciar todos os leads 
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
        </div>
        
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-widest">Nome</th>
                  <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-widest">Empresa</th>
                  <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-widest">Data</th>
                  <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map((lead: any) => (
                  <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                    <td className="p-5 font-bold text-slate-900 group-hover:text-primary transition-colors">{lead.nome}</td>
                    <td className="p-5 text-slate-600">{lead.empresa || '-'}</td>
                    <td className="p-5 text-slate-500 text-sm">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
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
                    <td colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-400">
                        <span className="material-symbols-outlined text-5xl opacity-30">person_off</span>
                        <p className="text-slate-500">Nenhum lead registrado ainda.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
