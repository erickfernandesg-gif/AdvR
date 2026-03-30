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
      alert('Erro ao atualizar status do lead.');
      setStatus(initialStatus); // Revert on error
    } finally {
      setUpdating(false);
    }
  };

  const getStatusClasses = (currentStatus: string) => {
    switch (currentStatus) {
      case 'novo':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'em_atendimento':
        return 'bg-accent/20 text-accent border border-accent/30';
      case 'convertido':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      default:
        return 'bg-white/10 text-muted-foreground border border-white/20';
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
