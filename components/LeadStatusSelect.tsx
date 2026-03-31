'use client';

import { useState } from 'react';
import { supabase } from '@/lib/db';

export default function LeadStatusSelect({ leadId, initialStatus }: { leadId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdating(true);

    try {
      if (supabase) {
        const { error } = await supabase
          .from('leads')
          .update({ status: newStatus })
          .eq('id', leadId);
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      // Revert on error without alert
      setStatus(initialStatus);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusClasses = (currentStatus: string) => {
    switch (currentStatus) {
      case 'novo':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'em_atendimento':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'convertido':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  return (
    <select 
      value={status}
      onChange={handleStatusChange}
      disabled={updating}
      className={`px-3 py-1 rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${getStatusClasses(status)} disabled:opacity-50`}
    >
      <option value="novo">NOVO</option>
      <option value="em_atendimento">EM ATENDIMENTO</option>
      <option value="convertido">CONVERTIDO</option>
      <option value="perdido">PERDIDO</option>
    </select>
  );
}
