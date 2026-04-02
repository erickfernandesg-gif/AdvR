import * as motion from "motion/react-client";
import Link from 'next/link';
import { getPostBySlug } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch the post from Supabase
  const dbPost = await getPostBySlug(slug);
  
  // Mock data as fallback for demo purposes
  const mockPost = {
    title: 'A Gestão Proativa na Remuneração Variável: Antecipando Desafios para Otimizar Resultados',
    category: 'Suporte Proativo',
    date: '17 Mar 2026',
    content: `
      <h2>Introdução</h2>
      <p>No dinâmico cenário empresarial atual, a capacidade de antecipar é um diferencial competitivo crucial. Isso se aplica intensamente à gestão da remuneração variável e dos programas de incentivo, onde uma abordagem proativa pode transformar desafios em oportunidades, impulsionando a performance e o engajamento das equipes. Longe de ser apenas uma resposta a problemas, a gestão proativa busca identificar e otimizar cenários antes que eles se manifestem, garantindo que os programas de incentivo estejam sempre alinhados aos objetivos estratégicos da organização.</p>
      
      <h2>O Que é Gestão Proativa em Remuneração Variável?</h2>
      <p>A gestão proativa em remuneração variável é uma metodologia que prioriza a identificação e a resolução de potenciais lacunas ou desalinhamentos nos programas de incentivo antes que eles impactem negativamente a performance ou a motivação dos colaboradores. Diferente de uma postura reativa – que age apenas após o problema surgir (ex: baixa performance, descontentamento com cálculos) – a abordagem proativa toma a iniciativa. Ela envolve a criação de mecanismos de monitoramento, análise e comunicação que previnem falhas, otimizam a estrutura das premiações e promovem uma cultura de transparência e eficiência.</p>
      
      <h2>Pilares da Gestão Proativa para Programas de Incentivo Eficazes</h2>
      <p>Para implementar uma gestão verdadeiramente proativa, as empresas podem focar em alguns pilares essenciais:</p>
      <ul>
        <li><strong>Monitoramento Contínuo:</strong> Acompanhamento constante dos indicadores de performance e das métricas de remuneração variável.</li>
        <li><strong>Análise Preditiva:</strong> Utilização de dados históricos e tendências para prever cenários futuros e ajustar as metas e premiações.</li>
        <li><strong>Comunicação Transparente:</strong> Diálogo constante e claro com as equipes sobre as regras, metas e resultados dos programas de incentivo.</li>
        <li><strong>Flexibilidade e Adaptabilidade:</strong> Capacidade de ajustar rapidamente os programas de incentivo em resposta a mudanças no mercado ou na estratégia da empresa.</li>
      </ul>

      <h2>Benefícios de uma Abordagem Proativa</h2>
      <p>A adoção de uma gestão proativa em programas de remuneração variável e incentivos gera impactos significativos:</p>
      <ul>
        <li><strong>Aumento do Engajamento:</strong> Colaboradores mais motivados e alinhados aos objetivos da empresa.</li>
        <li><strong>Melhoria da Performance:</strong> Resultados mais consistentes e alinhados às metas estratégicas.</li>
        <li><strong>Redução de Erros e Retrabalho:</strong> Processos mais eficientes e menos sujeitos a falhas.</li>
        <li><strong>Maior Transparência e Confiança:</strong> Relação mais transparente e confiável entre a empresa e seus colaboradores.</li>
      </ul>

      <h2>Conclusão</h2>
      <p>A gestão proativa não é apenas uma "boa prática"; é uma necessidade para organizações que buscam excelência em seus programas de remuneração variável. Ao antecipar necessidades, otimizar processos e fomentar uma cultura de transparência, as empresas garantem não apenas a precisão nos cálculos, mas principalmente o alinhamento estratégico e o máximo potencial de sua força de vendas e demais colaboradores. É um investimento contínuo que se traduz em resultados tangíveis e sustentáveis.</p>
    `
  };

  const post = dbPost || (slug === 'suporte-proativo' ? mockPost : null);

  if (!post) {
    notFound();
  }

  // Format date if it's from DB
  const displayDate = post.created_at 
    ? new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : (post.date || 'Mar 2026');

  return (
    <div className="flex flex-col bg-background min-h-screen pt-48 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Link href="/blog" className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors mb-12 font-bold uppercase tracking-widest text-xs">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Voltar para Insights
          </Link>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-border">
              {post.category}
            </div>
            <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
              {displayDate}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-12 tracking-tighter leading-[1.1]">
            {post.title}
          </h1>
          
          {post.image_url && (
            <div className="relative w-full h-[300px] md:h-[500px] mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="w-full h-px bg-border"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:font-extrabold prose-h2:text-4xl prose-h2:mt-20 prose-h2:mb-8 prose-h2:tracking-tight prose-p:text-muted-foreground prose-p:font-light prose-p:leading-relaxed prose-li:text-muted-foreground prose-li:font-light prose-a:text-primary hover:prose-a:text-accent transition-all"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <div className="mt-24 pt-12 border-t border-border">
          <div className="glass-panel p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">Gostou deste insight?</h3>
              <p className="text-muted-foreground font-light">Descubra como a AdvR pode aplicar essa inteligência no seu negócio.</p>
            </div>
            <Link href="/#contato" className="btn-electric whitespace-nowrap">
              Falar com Especialista
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
