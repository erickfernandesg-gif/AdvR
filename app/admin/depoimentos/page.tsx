'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/db';
import * as motion from 'motion/react-client';

interface Testimonial {
  id: string;
  nome: string;
  empresa: string;
  texto: string;
  img_url: string;
  created_at: string;
}

export default function AdminDepoimentos() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    texto: '',
    img_url: ''
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('depoimentos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTestimonials(data);
    } catch (error) {
      console.error('Erro ao buscar depoimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingId(testimonial.id);
      setFormData({
        nome: testimonial.nome,
        empresa: testimonial.empresa || '',
        texto: testimonial.texto,
        img_url: testimonial.img_url || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        empresa: '',
        texto: '',
        img_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingImage(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `depoimentos/${fileName}`;

      if (!supabase) return;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, img_url: data.publicUrl }));
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!supabase) return;

      if (editingId) {
        const { error } = await supabase
          .from('depoimentos')
          .update({
            nome: formData.nome,
            empresa: formData.empresa,
            texto: formData.texto,
            img_url: formData.img_url
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('depoimentos')
          .insert([{
            nome: formData.nome,
            empresa: formData.empresa,
            texto: formData.texto,
            img_url: formData.img_url
          }]);

        if (error) throw error;
      }

      await fetchTestimonials();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar depoimento:', error);
      alert('Erro ao salvar depoimento.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este depoimento?')) return;

    try {
      if (!supabase) return;
      
      const { error } = await supabase
        .from('depoimentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchTestimonials();
    } catch (error) {
      console.error('Erro ao excluir depoimento:', error);
      alert('Erro ao excluir depoimento.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">Depoimentos</h1>
          <p className="text-slate-500 font-medium mt-2">Gerencie os depoimentos exibidos na página inicial.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Novo Depoimento
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col relative group"
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleOpenModal(testimonial)}
                className="w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
              <button 
                onClick={() => handleDelete(testimonial.id)}
                className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              {testimonial.img_url ? (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100">
                  <img src={testimonial.img_url} alt={testimonial.nome} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl">
                  {testimonial.nome.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-900">{testimonial.nome}</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{testimonial.empresa}</p>
              </div>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed italic flex-1">&quot;{testimonial.texto}&quot;</p>
          </motion.div>
        ))}

        {testimonials.length === 0 && (
          <div className="col-span-full bg-slate-50 border border-slate-200 border-dashed rounded-[2rem] p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">format_quote</span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhum depoimento encontrado</h3>
            <p className="text-slate-500 mb-6">Adicione o primeiro depoimento para exibi-lo no site.</p>
            <button 
              onClick={() => handleOpenModal()}
              className="text-primary font-bold text-sm hover:underline"
            >
              Adicionar Depoimento
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-display font-bold text-slate-900">
                {editingId ? 'Editar Depoimento' : 'Novo Depoimento'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <form id="testimonial-form" onSubmit={handleSave} className="space-y-6">
                
                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Foto do Cliente</label>
                  <div className="flex items-center gap-6">
                    {formData.img_url ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg relative group">
                        <img src={formData.img_url} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, img_url: '' }))}
                            className="text-white hover:text-red-400"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 border-dashed flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-3xl">person</span>
                      </div>
                    )}
                    
                    <div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                      />
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {uploadingImage ? (
                          <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Enviando...</>
                        ) : (
                          <><span className="material-symbols-outlined text-sm">upload</span> Escolher Imagem</>
                        )}
                      </button>
                      <p className="text-xs text-slate-400 mt-2">Recomendado: 200x200px (JPG, PNG)</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nome</label>
                    <input 
                      type="text" 
                      required
                      value={formData.nome}
                      onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="Ex: Carlos Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Empresa / Cargo</label>
                    <input 
                      type="text" 
                      value={formData.empresa}
                      onChange={e => setFormData(prev => ({ ...prev, empresa: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="Ex: Diretor de Vendas, TechCorp"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Depoimento</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.texto}
                    onChange={e => setFormData(prev => ({ ...prev, texto: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    placeholder="O que o cliente disse sobre a AdvR..."
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
              <button 
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                form="testimonial-form"
                disabled={isSaving}
                className="bg-primary text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Salvando...</>
                ) : (
                  <><span className="material-symbols-outlined text-sm">save</span> Salvar Depoimento</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
