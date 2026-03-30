import { supabase } from '@/lib/db';
import { ExternalLink, Calendar, AlertCircle, Newspaper } from 'lucide-react';

// Define the type for our LinkedIn news
interface Novidade {
  id: string;
  titulo: string | null;
  conteudo: string | null;
  url_imagem: string | null;
  url_postagem: string | null;
  data_publicacao: string | null;
}

export const revalidate = 60; // Optional: revalidate every 60 seconds

export default async function NovidadesPage() {
  // Fetch data from Supabase
  let novidades: Novidade[] | null = null;
  let error: any = null;

  if (supabase) {
    const { data, error: fetchError } = await supabase
      .from('novidades_linkedin')
      .select('id, titulo, conteudo, url_imagem, url_postagem, data_publicacao')
      .order('data_publicacao', { ascending: false });
    
    novidades = data;
    error = fetchError;
  } else {
    error = { message: 'Supabase client not initialized. Check environment variables.' };
  }

  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data não informada';
    try {
      // Create date object and adjust for timezone if needed, but simple parsing usually works for ISO strings
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
    } catch (e) {
      return 'Data inválida';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block text-primary font-semibold tracking-widest uppercase text-sm mb-4">
            Fique por dentro
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tight mb-6">
            Nossas Novidades
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Acompanhe nossas últimas atualizações, artigos e postagens diretamente do nosso LinkedIn.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-md bg-red-50 p-6 max-w-3xl mx-auto mb-8 border border-red-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">
                  Ops! Tivemos um problema ao carregar as novidades.
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Não foi possível buscar as postagens no momento. Por favor, tente novamente mais tarde.
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="mt-2 text-xs opacity-75 font-mono bg-red-100 p-2 rounded">
                      Erro: {error.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && (!novidades || novidades.length === 0) && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
            <Newspaper className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">Nenhuma novidade ainda</h3>
            <p className="mt-2 text-gray-500">
              Ainda não temos postagens publicadas. Volte em breve para conferir nossas atualizações!
            </p>
          </div>
        )}

        {/* Featured Post (Latest) */}
        {!error && novidades && novidades.length > 0 && (
          <div className="mb-20">
            <a
              href={novidades[0].url_postagem || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col lg:flex-row bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 group"
            >
              {/* Featured Image */}
              <div className="lg:w-1/2 relative h-72 lg:h-auto bg-slate-100 overflow-hidden">
                {novidades[0].url_imagem ? (
                  <img
                    src={novidades[0].url_imagem}
                    alt={novidades[0].titulo || 'Imagem da postagem em destaque'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                    <Newspaper className="h-16 w-16 opacity-50" />
                  </div>
                )}
              </div>

              {/* Featured Content */}
              <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider">
                    Destaque
                  </span>
                  <div className="flex items-center text-sm text-slate-500 font-medium">
                    <Calendar className="mr-2 h-4 w-4" />
                    <time dateTime={novidades[0].data_publicacao || undefined}>
                      {formatDate(novidades[0].data_publicacao)}
                    </time>
                  </div>
                </div>

                {novidades[0].titulo && (
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-6 group-hover:text-primary transition-colors leading-tight">
                    {novidades[0].titulo}
                  </h3>
                )}

                <p className="text-slate-600 text-lg line-clamp-4 mb-8 leading-relaxed">
                  {novidades[0].conteudo || 'Sem conteúdo disponível.'}
                </p>

                {/* Footer / CTA */}
                <div className="mt-auto flex items-center text-primary font-semibold text-base group-hover:translate-x-2 transition-transform duration-300">
                  Ler artigo completo
                  <ExternalLink className="ml-2 h-5 w-5" />
                </div>
              </div>
            </a>
          </div>
        )}

        {/* Grid of Remaining Cards */}
        {!error && novidades && novidades.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {novidades.slice(1).map((post: Novidade) => (
              <a
                key={post.id}
                href={post.url_postagem || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                  {post.url_imagem ? (
                    <img
                      src={post.url_imagem}
                      alt={post.titulo || 'Imagem da postagem'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                      <Newspaper className="h-12 w-12 opacity-50" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-8">
                  <div className="flex items-center text-sm text-slate-500 font-medium mb-4">
                    <Calendar className="flex-shrink-0 mr-2 h-4 w-4" />
                    <time dateTime={post.data_publicacao || undefined}>
                      {formatDate(post.data_publicacao)}
                    </time>
                  </div>

                  {post.titulo && (
                    <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {post.titulo}
                    </h3>
                  )}

                  <p className="text-slate-600 text-base line-clamp-3 mb-8 flex-1 leading-relaxed">
                    {post.conteudo || 'Sem conteúdo disponível.'}
                  </p>

                  {/* Footer / CTA */}
                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
                    Ler no LinkedIn
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
