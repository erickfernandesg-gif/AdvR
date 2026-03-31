'use client';

export default function ExportCsvButton({ leads }: { leads: any[] }) {
  const handleExport = () => {
    if (!leads || leads.length === 0) {
      alert('Nenhum lead para exportar.');
      return;
    }

    // Define CSV headers
    const headers = ['ID', 'Nome', 'Empresa', 'Cargo', 'Email', 'Telefone', 'Status', 'Data de Criação'];
    
    // Map leads to CSV rows
    const rows = leads.map(lead => [
      lead.id,
      `"${lead.nome || ''}"`,
      `"${lead.empresa || ''}"`,
      `"${lead.cargo || ''}"`,
      `"${lead.email || ''}"`,
      `"${lead.telefone || ''}"`,
      lead.status,
      new Date(lead.created_at).toLocaleString('pt-BR')
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_advr_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      className="bg-white text-primary border border-slate-200 px-6 py-2.5 rounded-full font-medium hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
    >
      <span className="material-symbols-outlined">download</span>
      Exportar CSV
    </button>
  );
}
