import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcrdgnwpjtpvhcvxzswp.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  'sb_publishable_rBtJizSXa1MeJlzrbtDqMw_vDUDAq2H';

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

type ContentBlock = {
  id?: string;
  page_id?: string;
  block_name: string;
  order_index?: number;
  content: Record<string, any>;
};

const PAGE_BLOCK_PRIORITY: Record<string, string[]> = {
  '/': [
    'hero_section',
    'social_proof',
    'value_proposition',
    'solucoes_bento',
    'audience_section',
    'data_belt',
    'highlight_card',
    'roi_calculator',
    'case_study',
    'testimonials',
    'video_section',
    'blog_preview',
    'blog_highlight',
    'cta_section',
  ],
  '/solucoes': ['hero_section', 'value_proposition', 'pipeline_visual', 'technical_focus', 'cta_section'],
  '/portal': ['hero_section', 'value_proposition', 'portal_features', 'solucoes_bento', 'cta_section'],
  '/blog': ['hero_section', 'blog_highlight', 'blog_list', 'cta_section'],
  '/empresa': ['hero_section', 'social_proof', 'timeline_modern', 'solucoes_bento', 'culture_section', 'contact_section'],
};

const HOME_DEFAULT_ORDER: Record<string, number> = {
  hero_section: 10,
  social_proof: 20,
  value_proposition: 30,
  solucoes_bento: 40,
  audience_section: 50,
  data_belt: 60,
  highlight_card: 70,
  case_study: 80,
  testimonials: 85,
  video_section: 90,
  blog_preview: 100,
  cta_section: 110,
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const HOME_SOLUTIONS_CONTENT = {
  eyebrow: 'Soluções AdvR',
  title: 'Tecnologia e serviços para toda a jornada de remuneração variável.',
  subtitle: 'Escolha os componentes adequados ao momento e à complexidade da sua operação.',
  cards: [
    {
      id: 'colossus',
      icon: 'calculate',
      title: 'Motor Colossus',
      description: 'Estruture regras e cálculos complexos com mais controle, rastreabilidade e segurança.',
    },
    {
      id: 'portal',
      icon: 'dashboard',
      title: 'Portal de Incentivos',
      description: 'Aproxime metas, extratos, resultados e comunicações de gestores e participantes.',
    },
    {
      id: 'bi',
      icon: 'analytics',
      title: 'Dados e BI',
      description: 'Transforme informações de remuneração em visões úteis para acompanhamento e decisão.',
    },
    {
      id: 'consultoria',
      icon: 'support_agent',
      title: 'Consultoria especializada',
      description: 'Conte com experiência de negócio para desenhar, revisar e evoluir seus processos.',
    },
  ],
};

const PAGE_ENHANCEMENTS: Record<string, ContentBlock[]> = {
  '/': [
    {
      id: 'injected-value-proposition-home',
      block_name: 'value_proposition',
      order_index: 30,
      content: {
        eyebrow: 'Da complexidade ao controle',
        title: 'Sua operação de remuneração variável pode ser mais simples.',
        subtitle: 'A AdvR conecta regras, dados e pessoas para reduzir esforço operacional e dar mais clareza a cada ciclo.',
        items: [
          {
            icon: 'table_view',
            title: 'Menos trabalho manual',
            description: 'Centralize regras e substitua controles dispersos por um processo estruturado.',
          },
          {
            icon: 'visibility',
            title: 'Mais transparência',
            description: 'Dê visibilidade para gestores e participantes sem perder governança.',
          },
          {
            icon: 'verified_user',
            title: 'Mais segurança',
            description: 'Mantenha histórico, critérios e aprovações organizados para cada fechamento.',
          },
        ],
      },
    },
    {
      id: 'injected-audience-home',
      block_name: 'audience_section',
      order_index: 50,
      content: {
        eyebrow: 'Uma visão para cada área',
        title: 'Conecte quem define, calcula, aprova e acompanha os resultados.',
        subtitle: 'A mesma operação precisa responder às necessidades de diferentes áreas sem perder consistência.',
        items: [
          {
            icon: 'groups',
            title: 'RH e Remuneração',
            description: 'Estruture políticas, critérios e comunicação com mais clareza.',
          },
          {
            icon: 'account_balance',
            title: 'Financeiro',
            description: 'Ganhe previsibilidade, rastreabilidade e segurança nas aprovações.',
          },
          {
            icon: 'monitoring',
            title: 'Vendas e Operações',
            description: 'Aproxime metas e resultados de gestores e participantes.',
          },
          {
            icon: 'database',
            title: 'Tecnologia e Dados',
            description: 'Organize integrações e reduza fluxos manuais entre sistemas.',
          },
        ],
      },
    },
    {
      id: 'injected-case-study-home',
      block_name: 'case_study',
      order_index: 80,
      content: {
        eyebrow: 'Um cenário comum nas empresas',
        title: 'De controles dispersos a uma operação mais previsível.',
        subtitle: 'Um exemplo de como a abordagem AdvR organiza as partes mais críticas de um ciclo de remuneração variável.',
        problem_title: 'O desafio',
        problem: 'Regras complexas, dados em diferentes fontes e alto esforço de conferência a cada fechamento.',
        solution_title: 'A abordagem',
        solution: 'Centralização das regras, estruturação do fluxo de dados e definição clara das etapas de aprovação.',
        result_title: 'O resultado esperado',
        result: 'Mais controle operacional, rastreabilidade e transparência para gestores e participantes.',
        button_text: 'Conversar sobre meu cenário',
        button_link: '/contato',
      },
    },
    {
      id: 'injected-blog-preview-home',
      block_name: 'blog_preview',
      order_index: 100,
      content: {
        eyebrow: 'Conteúdos e novidades',
        title: 'Conhecimento para evoluir sua gestão de resultados.',
        subtitle: 'Acompanhe análises, boas práticas e atualizações da AdvR.',
        button_text: 'Ver todos os insights',
      },
    },
    {
      id: 'injected-cta-home',
      block_name: 'cta_section',
      order_index: 110,
      content: {
        eyebrow: 'Converse com a AdvR',
        title: 'Quer simplificar seu próximo ciclo de remuneração variável?',
        subtitle: 'Conte como funciona sua operação hoje e veja como podemos estruturar uma solução adequada ao seu cenário.',
        button_text: 'Agendar demonstração',
        button_link: '/contato',
        secondary_text: 'Conhecer as soluções',
        secondary_link: '/solucoes',
      },
    },
  ],
  '/solucoes': [
    {
      id: 'injected-value-proposition-solutions',
      block_name: 'value_proposition',
      order_index: 20,
      content: {
        eyebrow: 'Resultados para o negócio',
        title: 'Tecnologia que acompanha a complexidade da sua operação.',
        subtitle: 'Estruture cálculos, aprovações e comunicação em uma jornada mais previsível para todas as áreas envolvidas.',
        items: [
          {
            icon: 'calculate',
            title: 'Cálculos estruturados',
            description: 'Organize diferentes regras, pesos, indicadores e ciclos em um fluxo único.',
          },
          {
            icon: 'account_tree',
            title: 'Integração de dados',
            description: 'Conecte as informações necessárias para diminuir retrabalho e inconsistências.',
          },
          {
            icon: 'fact_check',
            title: 'Governança do ciclo',
            description: 'Acompanhe aprovações, versões e entregas com mais rastreabilidade.',
          },
        ],
      },
    },
    {
      id: 'injected-cta-solutions',
      block_name: 'cta_section',
      order_index: 90,
      content: {
        eyebrow: 'Veja na prática',
        title: 'Vamos entender as regras e os desafios da sua operação.',
        subtitle: 'Agende uma conversa para conhecer a abordagem da AdvR e avaliar o melhor caminho para sua empresa.',
        button_text: 'Agendar demonstração',
        button_link: '/contato',
        secondary_text: 'Conhecer o Portal',
        secondary_link: '/portal',
      },
    },
  ],
  '/portal': [
    {
      id: 'injected-value-proposition-portal',
      block_name: 'value_proposition',
      order_index: 20,
      content: {
        eyebrow: 'Experiência para gestores e participantes',
        title: 'Informação acessível durante todo o ciclo.',
        subtitle: 'O Portal aproxima as pessoas das metas, resultados e comunicações importantes sem abrir mão de controle.',
        items: [
          {
            icon: 'monitoring',
            title: 'Acompanhamento',
            description: 'Consulte indicadores, resultados e informações relevantes em um só lugar.',
          },
          {
            icon: 'devices',
            title: 'Acesso simplificado',
            description: 'Uma experiência preparada para diferentes dispositivos e perfis de usuário.',
          },
          {
            icon: 'campaign',
            title: 'Comunicação clara',
            description: 'Compartilhe avisos e conteúdos importantes com a audiência certa.',
          },
        ],
      },
    },
    {
      id: 'injected-cta-portal',
      block_name: 'cta_section',
      order_index: 90,
      content: {
        eyebrow: 'Conheça o Portal',
        title: 'Mostre resultados com mais clareza para sua equipe.',
        subtitle: 'Agende uma demonstração e veja como o Portal pode apoiar a experiência dos participantes.',
        button_text: 'Agendar demonstração',
        button_link: '/contato',
        secondary_text: 'Ver todas as soluções',
        secondary_link: '/solucoes',
      },
    },
  ],
  '/blog': [
    {
      id: 'injected-cta-blog',
      block_name: 'cta_section',
      order_index: 90,
      content: {
        eyebrow: 'Continue acompanhando',
        title: 'Veja também as novidades da AdvR.',
        subtitle: 'Acompanhe publicações, eventos e atualizações compartilhadas em nossos canais.',
        button_text: 'Ver novidades',
        button_link: '/novidades',
        secondary_text: 'Falar com um especialista',
        secondary_link: '/contato',
      },
    },
  ],
};

function enhancePageBlocks(slug: string, sourceBlocks: ContentBlock[], pageId?: string) {
  let blocks = sourceBlocks.map((block) => {
    const content = { ...block.content };

    if (block.block_name === 'hero_section') {
      const legacyHeroCopy: Record<string, { titles: string[]; content: Record<string, any> }> = {
        '/': {
          titles: ['Engenharia de Remuneração Variável para a Elite Corporativa.'],
          content: {
            eyebrow: 'Remuneração variável com clareza e controle',
            title: 'Remuneração variável sem planilhas, erros ou atrasos.',
            subtitle: 'Estruture cálculos complexos, dê transparência ao time e conduza cada ciclo com mais segurança.',
            primary_button: 'Agendar demonstração',
            primary_button_link: '/contato',
            secondary_button: 'Conhecer soluções',
            secondary_button_link: '/solucoes',
            image_url: '',
          },
        },
        '/empresa': {
          titles: ['CREDIBILIDADE E CONFIANÇA É O QUE NOS MOVE HÁ 30 ANOS'],
          content: {
            eyebrow: 'Experiência que evolui com o mercado',
            title: 'Há mais de 30 anos, transformamos complexidade em resultados.',
            subtitle: 'Unimos conhecimento em remuneração variável, tecnologia e atendimento próximo para apoiar operações que exigem confiança.',
            primary_button: 'Falar com um especialista',
            primary_button_link: '/contato',
            secondary_button: 'Conhecer soluções',
            secondary_button_link: '/solucoes',
            image_url: '',
          },
        },
        '/solucoes': {
          titles: ['O Motor Colossus. Tecnologia de Elite para Remuneração.'],
          content: {
            eyebrow: 'Soluções AdvR',
            title: 'Tecnologia e conhecimento para cada etapa da remuneração variável.',
            subtitle: 'Conecte dados, regras, aprovações e comunicação em uma operação mais clara e previsível.',
            primary_button: 'Agendar demonstração',
            primary_button_link: '/contato',
            secondary_button: 'Entender o processo',
            secondary_button_link: '#processo',
            image_url: '',
          },
        },
        '/portal': {
          titles: ['Portal de Incentivos', 'Portal de Incentivos: Plataforma Inteligente'],
          content: {
            eyebrow: 'Portal de Incentivos',
            title: 'Metas e resultados mais próximos de quem faz acontecer.',
            subtitle: 'Centralize extratos, indicadores, conteúdos e comunicações em uma experiência simples para gestores e participantes.',
            primary_button: 'Agendar demonstração',
            primary_button_link: '/contato',
            secondary_button: 'Ver recursos',
            secondary_button_link: '#recursos',
            image_url: '',
            compact: true,
          },
        },
        '/blog': {
          titles: ['Insights de Elite', 'Insights & Estratégia. O Futuro da Remuneração.'],
          content: {
            eyebrow: 'Conhecimento AdvR',
            title: 'Ideias práticas para evoluir sua gestão de resultados.',
            subtitle: 'Conteúdos sobre remuneração variável, tecnologia, governança e engajamento.',
            primary_button: 'Ver artigos',
            primary_button_link: '#artigos',
            secondary_button: 'Ver novidades',
            secondary_button_link: '/novidades',
            image_url: '',
            compact: true,
          },
        },
      };

      const replacement = legacyHeroCopy[slug];
      if (replacement?.titles.includes(content.title)) {
        Object.assign(content, replacement.content);
      }
    }

    if (
      slug === '/' &&
      block.block_name === 'highlight_card' &&
      (content.stat === '24h' || String(content.title || '').includes('24 Horas'))
    ) {
      Object.assign(content, {
        eyebrow: 'Experiência aplicada à operação',
        title: 'Conhecimento de negócio e tecnologia trabalhando no mesmo processo.',
        description: 'A AdvR combina experiência em remuneração variável com uma estrutura tecnológica preparada para regras, dados e ciclos complexos.',
        stat: '30+',
        stat_label: 'anos acompanhando a evolução da remuneração variável',
      });
    }

    if (
      slug === '/' &&
      block.block_name === 'solucoes_bento' &&
      (!Array.isArray(content.cards) || content.cards.length === 0)
    ) {
      Object.assign(content, HOME_SOLUTIONS_CONTENT);
      delete content.companies;
    }

    if (
      slug === '/' &&
      block.block_name === 'video_section' &&
      String(content.title || '').toUpperCase().includes('ENTENDA O QUE JÁ FIZEMOS')
    ) {
      content.title = 'Veja como a AdvR transforma operações complexas';
    }

    if (
      slug === '/contato' &&
      block.block_name === 'contact_section' &&
      ['Fale Conosco. Vamos Transformar seus Resultados.', 'Agende uma Conversa Estratégica.'].includes(content.title)
    ) {
      Object.assign(content, {
        title: 'Vamos entender sua operação.',
        subtitle: 'Conte como funciona seu processo de remuneração variável e quais desafios você precisa resolver.',
        form_title: 'Conte seu desafio',
        form_button: 'Enviar solicitação',
      });
    }

    return {
      ...block,
      id: block.id || `fallback-${slug.replace(/\W+/g, '-') || 'home'}-${block.block_name}`,
      content,
    };
  });

  if (slug === '/') {
    // Remove the legacy duplicate created when company data was saved into
    // a timeline block. The valid social_proof block and its logos stay intact.
    blocks = blocks.filter((block) => !(
      block.block_name === 'timeline_modern' &&
      Array.isArray(block.content.companies) &&
      !Array.isArray(block.content.milestones)
    ));

    // Page sections are singletons. Keep the earliest persisted occurrence.
    const seen = new Set<string>();
    blocks = blocks
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .filter((block) => {
        if (seen.has(block.block_name)) return false;
        seen.add(block.block_name);
        return true;
      });
  }

  for (const enhancement of PAGE_ENHANCEMENTS[slug] || []) {
    if (!blocks.some((block) => block.block_name === enhancement.block_name)) {
      blocks.push({
        ...enhancement,
        id: enhancement.id || `injected-${slug.replace(/\W+/g, '-') || 'home'}-${enhancement.block_name}`,
        page_id: pageId,
        order_index: enhancement.order_index ?? 999,
      });
    }
  }

  if (slug === '/' && blocks.some((block) => !UUID_PATTERN.test(block.id || ''))) {
    blocks = blocks.map((block) => ({
      ...block,
      order_index: HOME_DEFAULT_ORDER[block.block_name] ?? block.order_index ?? 999,
    }));
  }

  const priority = PAGE_BLOCK_PRIORITY[slug];
  if (!priority) return blocks;

  // Persisted order_index is the source of truth so rearranging blocks in
  // /admin/pages is reflected publicly. Priority is only a fallback for
  // legacy or non-persisted blocks without an order.
  return blocks.sort((a, b) => {
    const aIndex = priority.indexOf(a.block_name);
    const bIndex = priority.indexOf(b.block_name);
    const aFallback = aIndex === -1 ? 999 : (aIndex + 1) * 10;
    const bFallback = bIndex === -1 ? 999 : (bIndex + 1) * 10;
    return (a.order_index ?? aFallback) - (b.order_index ?? bFallback);
  });
}

export async function getGlobalSettings() {
  if (supabase) {
    const { data } = await supabase.from('global_settings').select('*').single();
    if (data) return data;
  }
  return {
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    phone_number: '+55 11 9999-9999',
    email_contact: 'contato@advr.com.br',
    logo_url: '',
    google_analytics_id: '',
    custom_script_head: '',
    linkedin_url: '',
    instagram_url: ''
  };
}

export async function getPageMetadata(slug: string) {
  if (supabase) {
    const { data } = await supabase
      .from('pages')
      .select('id, meta_title, meta_description, og_image_url, no_index')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      return {
        id: data.id,
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        og_image_url: data.og_image_url || '',
        no_index: Boolean(data.no_index),
      };
    }
  }

  return {
    id: '',
    meta_title: '',
    meta_description: '',
    og_image_url: '',
    no_index: false,
  };
}

export async function getPageBlocks(slug: string) {
  if (slug === '/empresa') {
    const fallbackBlocks = [
      {
        block_name: 'hero_section',
        content: {
          title: 'CREDIBILIDADE E CONFIANÇA É O QUE NOS MOVE HÁ 30 ANOS',
          subtitle: 'A Advanced Resources é uma empresa focada em soluções para gestão de resultados através de incentivos (remuneração variável), atuando no mercado há mais de 30 anos sempre de forma inovadora, utilizando metodologias modernas para entregar o melhor aos nossos clientes.',
          primary_button: 'Entre em Contato',
          secondary_button: 'Fale no WhatsApp',
          image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
          image_link: '/contato'
        }
      },
      {
        block_name: 'timeline_modern',
        content: {
          title: 'Nossa Jornada de Excelência',
          milestones: [
            {
              year: '1994',
              title: 'Fundação',
              description: 'Início das operações focadas em consultoria de remuneração estratégica em São Paulo.'
            },
            {
              year: '2014',
              title: 'Era Digital',
              description: 'Lançamento das primeiras plataformas de automação de incentivos e BI.'
            },
            {
              year: '2024',
              title: 'Liderança & IA',
              description: 'Consolidação como referência em gestão proativa e integração de dados complexos.'
            }
          ]
        }
      },
      {
        block_name: 'solucoes_bento',
        content: {
          title: 'Nossos Pilares Estratégicos',
          subtitle: 'Missão, Visão e Valores que guiam nossa entrega de elite.',
          cards: [
            {
              id: 'missao',
              title: 'Missão',
              tag: 'Propósito',
              description: 'Transformar a gestão de resultados através de tecnologia e inteligência, gerando valor real para empresas e colaboradores.',
              icon: 'rocket_launch'
            },
            {
              id: 'visao',
              title: 'Visão',
              tag: 'Futuro',
              description: 'Ser a principal parceira estratégica das maiores corporações do Brasil em engenharia de remuneração variável.',
              icon: 'visibility'
            },
            {
              id: 'valores',
              title: 'Valores',
              tag: 'DNA',
              description: 'Ética, Transparência, Inovação Constante e Foco Absoluto no Resultado do Cliente.',
              icon: 'verified'
            }
          ]
        }
      },
      {
        block_name: 'social_proof',
        content: {
          title: 'Líderes de Mercado que Confiam na AdvR',
          companies: ['PHARMACO', 'LOGISTIX', 'FINTECH_CO', 'RETAIL_PRO', 'CORP_GEN']
        }
      },
      {
        block_name: 'culture_section',
        content: {
          title: 'Inovação e Engajamento',
          description: 'Inovando com visões e facilitadores para engajar seu time de vendas com suas metas, onde eles estiverem, deixando seu sistema de RV transparente, flexível e potencializando seus resultados.',
          tags: ['Transparência', 'Flexibilidade', 'Engajamento', 'Inovação', 'Metodologias Modernas']
        }
      },
      {
        block_name: 'contact_section',
        content: {
          title: 'Fale com nossos especialistas',
          subtitle: 'Estamos prontos para ajudar a sua empresa a alcançar novos resultados.',
          email: 'contato@advresources.com.br',
          location: 'São Paulo, SP - Brasil',
          phone: '11 4123 9260',
          whatsapp: '55 11 99388-8190',
          form_title: 'Envie uma mensagem',
          form_button: 'Enviar'
        }
      }
    ];

    const normalizedFallbackBlocks = fallbackBlocks.map((block, index) => ({
      ...block,
      order_index: (index + 1) * 10
    }));

    if (supabase) {
      try {
        const { data: page } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (page) {
          const { data: persistedBlocks } = await supabase
            .from('page_blocks')
            .select('*')
            .eq('page_id', page.id)
            .order('order_index');

          if (persistedBlocks) {
            const persistedByName = new Map(
              persistedBlocks.map(block => [block.block_name, block])
            );

            // Preserve the complete Empresa layout while hydrating every
            // already-persisted block with its Supabase ID and content.
            return enhancePageBlocks(slug, normalizedFallbackBlocks.map(fallbackBlock => {
              const persistedBlock = persistedByName.get(fallbackBlock.block_name);

              return persistedBlock
                ? {
                    ...fallbackBlock,
                    ...persistedBlock,
                    content: persistedBlock.content,
                    order_index: fallbackBlock.order_index
                  }
                : {
                    ...fallbackBlock,
                    page_id: page.id
                  };
            }), page.id);
          }
        }
      } catch (error) {
        console.error('Error loading Empresa blocks:', error);
      }
    }

    return enhancePageBlocks(slug, normalizedFallbackBlocks);
  }

  if (supabase) {
    const { data: page } = await supabase.from('pages').select('id').eq('slug', slug).single();
    if (page) {
      const { data: blocks } = await supabase.from('page_blocks').select('*').eq('page_id', page.id).order('order_index');
      if (blocks && blocks.length > 0) {
        // Inject latest post into blog_highlight if it exists
        const highlightBlock = blocks.find(b => b.block_name === 'blog_highlight');
        if (highlightBlock) {
          try {
            const { data: latestPost } = await supabase
              .from('posts')
              .select('title, excerpt, category, slug, image_url')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            
            if (latestPost) {
              highlightBlock.content.post = latestPost;
            }
          } catch (e) {
            console.warn('Could not fetch latest post for highlight');
          }
        }

        // Inject blog_list if missing for /blog
        if (slug === '/blog' && !blocks.find(b => b.block_name === 'blog_list')) {
          blocks.push({
            id: 'injected-blog-list',
            page_id: page.id,
            block_name: 'blog_list',
            order_index: 99,
            content: {
              title: 'Todos os Insights',
              subtitle: 'Acesse nossa biblioteca completa de conhecimento.'
            }
          });
        }

        // Inject testimonials if missing for /
        if (slug === '/' && !blocks.find(b => b.block_name === 'testimonials')) {
          blocks.push({
            id: 'injected-testimonials',
            page_id: page.id,
            block_name: 'testimonials',
            order_index: 85,
            content: {
              title: 'O que dizem nossos clientes',
              subtitle: 'Histórias reais de empresas que transformaram sua gestão de remuneração variável com a AdvR.'
            }
          });
          
          // Sort again by order_index just in case
          blocks.sort((a, b) => a.order_index - b.order_index);
        }

        return enhancePageBlocks(slug, blocks, page.id);
      }
    }
  }
  
  if (slug === '/') {
    let latestPost = {
      title: 'A Gestão Proativa na Remuneração Variável',
      excerpt: 'Como antecipar desafios e otimizar resultados através da análise preditiva e feedback contínuo.',
      category: 'Suporte Proativo',
      slug: 'suporte-proativo',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80'
    };

    if (supabase) {
      try {
        const { data } = await supabase
          .from('posts')
          .select('title, excerpt, category, slug, image_url')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (data) {
          latestPost = data;
        }
      } catch (e) {
        console.warn('Could not fetch latest post for highlight, using fallback');
      }
    }

    return [
      {
        block_name: 'hero_section',
        content: {
          title: 'Engenharia de Remuneração Variável para a Elite Corporativa.',
          subtitle: 'Transformamos dados complexos em performance extraordinária com o Motor Colossus.',
          primary_button: 'Solicitar Demo Colossus',
          secondary_button: 'Conversa Estratégica',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
          image_link: '/solucoes'
        }
      },
      {
        block_name: 'blog_highlight',
        content: {
          title: 'Insights de Elite',
          subtitle: 'Explorando a intersecção entre tecnologia e performance.',
          post: latestPost
        }
      },
      {
        block_name: 'highlight_card',
        content: {
          title: 'Motor Colossus: Da Ingestão ao Extrato em 24 Horas.*',
          description: 'Nossa engine proprietária processa volumes massivos de dados com precisão matemática, garantindo compliance e agilidade extrema.',
          stat: '24h',
          stat_label: 'SLA de Processamento'
        }
      },
      {
        block_name: 'solucoes_bento',
        content: {
          title: 'A Vitrine de Inteligência AdvR',
          subtitle: 'Soluções projetadas para Diretores e VPs que buscam transparência financeira e performance.',
          cards: [
            {
              id: 'colossus',
              title: 'Colossus',
              tag: 'Compliance & Agilidade',
              description: 'Cálculo automatizado de premiação com garantia de entrega e segurança enterprise.',
              icon: 'calculate'
            },
            {
              id: 'portal',
              title: 'Portal de Incentivos',
              tag: 'Engajamento & Transparência',
              description: 'Plataforma completa para que sua equipe acompanhe extratos e metas em tempo real.',
              icon: 'dashboard'
            },
            {
              id: 'bi',
              title: 'BI Integration',
              tag: 'Insights em Tempo Real',
              description: 'Dashboards avançados que transformam dados de remuneração em decisões estratégicas.',
              icon: 'analytics'
            },
            {
              id: 'proativo',
              title: 'Gestão Proativa',
              tag: 'Análise Preditiva',
              description: 'Não apenas calculamos, antecipamos desafios e otimizamos resultados antes do fechamento.',
              icon: 'query_stats'
            }
          ]
        }
      },
      {
        block_name: 'roi_calculator',
        content: {
          title: 'Simule sua Economia com AdvR',
          subtitle: 'Descubra quanto sua empresa pode economizar eliminando erros de cálculo e processos manuais.',
          cta_text: 'Solicitar Estudo de ROI Completo'
        }
      },
      {
        block_name: 'data_belt',
        content: {
          title: 'Esteira de Dados Inteligente',
          steps: [
            { label: 'Integrar via API (ETL)', icon: 'api' },
            { label: 'Ponderar Regras', icon: 'rule' },
            { label: 'Calcular Cenários', icon: 'functions' },
            { label: 'Workflow de Aprovação', icon: 'fact_check' },
            { label: 'Entrega de Extratos', icon: 'send' }
          ]
        }
      },
      {
        block_name: 'video_section',
        content: {
          title: 'ENTENDA O QUE JÁ FIZEMOS PARA AJUDAR A ANA E O ROBERTO',
          video_id: 'tgVis6b6ZfE',
          description: 'Veja como a AdvR transformou a gestão de remuneração para nossos clientes reais.'
        }
      },
      {
        block_name: 'social_proof',
        content: {
          title: 'Líderes de Mercado que Confiam na AdvR',
          companies: ['PHARMACO', 'LOGISTIX', 'FINTECH_CO', 'RETAIL_PRO', 'CORP_GEN']
        }
      },
      {
        block_name: 'testimonials',
        content: {
          title: 'O que dizem nossos clientes',
          subtitle: 'Histórias reais de empresas que transformaram sua gestão de remuneração variável com a AdvR.'
        }
      },
      {
        block_name: 'blog_preview',
        content: {
          title: 'Insights de Elite para Gestão de Resultados',
          subtitle: 'Acesse as melhores práticas do mercado de remuneração variável.',
          button_text: 'Ver Todos os Insights'
        }
      },
      {
        block_name: 'cta_section',
        content: {
          title: 'Pronto para elevar o nível da sua Remuneração Variável?',
          subtitle: 'Agende uma conversa estratégica com nossos especialistas.',
          button_text: 'Agendar Conversa Estratégica'
        }
      }
    ];
  }
  
  if (slug === '/solucoes') {
    return [
      {
        block_name: 'hero_section',
        content: {
          title: 'O Motor Colossus. Tecnologia de Elite para Remuneração.',
          subtitle: 'Nossa tecnologia proprietária foi desenhada para lidar com a complexidade da remuneração variável de grandes corporações.',
          primary_button: 'Solicitar Demo',
          secondary_button: 'Ver Documentação',
          image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
          image_link: ''
        }
      },
      {
        block_name: 'pipeline_visual',
        content: {
          title: 'A Esteira de Dados AdvR',
          steps: [
            { id: '01', title: 'Integrar API', description: 'Conexão direta com seu ERP ou CRM. Ingestão de dados segura.', icon: 'api' },
            { id: '02', title: 'Ponderar Regras', description: 'Aplicação de pesos e critérios complexos de remuneração.', icon: 'rule' },
            { id: '03', title: 'Calcular Cenários', description: 'Processamento em tempo real pelo Motor Colossus.', icon: 'calculate' },
            { id: '04', title: 'Aprovar & Entregar', description: 'Workflow de aprovação e entrega de extratos.', icon: 'verified_user' }
          ]
        }
      },
      {
        block_name: 'technical_focus',
        content: {
          title: 'Foco em Compliance & Segurança',
          features: [
            { title: 'Criptografia de Ponta a Ponta', description: 'Seus dados financeiros protegidos.', icon: 'lock' },
            { title: 'Trilha de Auditoria Completa', description: 'Cada alteração de regra ou valor é registrada.', icon: 'history' },
            { title: 'Disponibilidade Enterprise', description: 'Infraestrutura escalável para milhões de registros.', icon: 'cloud_done' }
          ],
          cta_title: 'Por que o Colossus?',
          cta_description: 'Diferente de planilhas ou sistemas genéricos, o Colossus foi construído especificamente para as nuances do mercado brasileiro.',
          cta_button: 'Ver Demo Técnica'
        }
      }
    ];
  }

  if (slug === '/blog') {
    let latestPost = {
      title: 'A Gestão Proativa na Remuneração Variável',
      excerpt: 'Como antecipar desafios e otimizar resultados através da análise preditiva e feedback contínuo.',
      category: 'Suporte Proativo',
      slug: 'suporte-proativo',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80'
    };

    if (supabase) {
      try {
        const { data } = await supabase
          .from('posts')
          .select('title, excerpt, category, slug, image_url')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (data) {
          latestPost = data;
        }
      } catch (e) {
        console.warn('Could not fetch latest post for highlight, using fallback');
      }
    }

    return [
      {
        block_name: 'hero_section',
        content: {
          title: 'Insights de Elite',
          subtitle: 'Explorando a intersecção entre tecnologia, precisão matemática e performance humana na remuneração variável.',
          primary_button: 'Assinar Newsletter',
          secondary_button: 'Ver Artigos',
          primary_button_link: '#newsletter',
          secondary_button_link: '#artigos',
          image_url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80',
          image_link: ''
        }
      },
      {
        block_name: 'blog_highlight',
        content: {
          title: 'Destaque do Mês',
          subtitle: 'O artigo mais lido pela nossa comunidade de diretores.',
          post: latestPost
        }
      },
      {
        block_name: 'blog_list',
        content: {
          title: 'Todos os Insights',
          subtitle: 'Acesse nossa biblioteca completa de conhecimento.'
        }
      }
    ];
  }

  if (slug === '/contato') {
    return [
      {
        block_name: 'contact_section',
        content: {
          title: 'Agende uma Conversa Estratégica.',
          subtitle: 'Nossos especialistas estão prontos para entender seus desafios em remuneração variável.',
          email: 'contato@advr.com.br',
          location: 'São Paulo, SP - Brasil',
          form_title: 'Solicitar Demonstração do Colossus',
          form_button: 'Agendar Demonstração'
        }
      }
    ];
  }

  if (slug === '/portal') {
    return [
      {
        block_name: 'hero_section',
        content: {
          title: 'Portal de Incentivos: Plataforma Inteligente',
          subtitle: 'Utilize de qualquer lugar, em qualquer dispositivo. Visualize as principais informações e avisos sobre a premiação.',
          image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
          image_link: '',
          primary_button: 'Acessar Portal',
          secondary_button: 'Fale Conosco'
        }
      },
      {
        block_name: 'solucoes_bento',
        content: {
          title: 'Recursos do Portal',
          subtitle: 'Tudo o que sua força de vendas precisa em um só lugar.',
          cards: [
            {
              id: 'extrato',
              tag: 'Transparência',
              icon: 'receipt_long',
              title: 'Extratos',
              description: 'Download do resultado do mês corrente ou anteriores em PDF, com histórico de visualização.'
            },
            {
              id: 'relatorios',
              tag: 'Performance',
              icon: 'bar_chart',
              title: 'Relatórios & Infográficos',
              description: 'Relatórios analíticos e simplificados em planilha. Infográficos com filtros por produto e KPI.'
            },
            {
              id: 'conteudos',
              tag: 'Comunicação',
              icon: 'folder_open',
              title: 'Conteúdos',
              description: 'Upload de vídeos, arquivos de texto, planilhas e apresentações. Registro de acessos e downloads.'
            },
            {
              id: 'politicas',
              tag: 'Compliance',
              icon: 'policy',
              title: 'Políticas',
              description: 'Regras de remuneração variável com notificação por e-mail e aceite/de acordo digital.'
            },
            {
              id: 'calculadora',
              tag: 'Simulação',
              icon: 'calculate',
              title: 'Calculadora Virtual',
              description: 'Simule os valores de premiação, comissionamento ou campanhas de forma rápida e fácil.'
            },
            {
              id: 'bi',
              tag: 'Inteligência',
              icon: 'query_stats',
              title: 'Análise BI',
              description: 'Relatórios customizados e disponibilizados diretamente no portal através de ferramentas de BI.'
            }
          ]
        }
      }
    ];
  }

  return [];
}

export async function getLeads() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  }
  return [];
}

export async function getLeadsCount() {
  if (supabase) {
    try {
      const { count, error } = await supabase.from('leads').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching leads count:', error);
      return 0;
    }
  }
  return 0;
}

export async function getNewLeadsCount() {
  if (supabase) {
    try {
      const { count, error } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'novo');
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching new leads count:', error);
      return 0;
    }
  }
  return 0;
}

export async function getPages() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('pages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pages:', error);
      return [];
    }
  }
  return [];
}

export async function getPagesCount() {
  if (supabase) {
    try {
      const { count, error } = await supabase.from('pages').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching pages count:', error);
      return 0;
    }
  }
  return 0;
}

export async function getPosts() {
  const fallbackPosts = [
    {
      id: 'fallback-1',
      title: 'A Gestão Proativa na Remuneração Variável: Antecipando Desafios para Otimizar Resultados',
      excerpt: 'No dinâmico cenário empresarial atual, a capacidade de antecipar é um diferencial competitivo crucial. Isso se aplica intensamente à gestão da remuneração variável.',
      category: 'Suporte Proativo',
      slug: 'suporte-proativo',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      created_at: new Date().toISOString()
    }
  ];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('relation "posts" does not exist')) {
          console.warn('Table "posts" not found, returning fallback');
          return fallbackPosts;
        }
        throw error;
      }
      
      if (!data || data.length === 0) {
        return fallbackPosts;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return fallbackPosts;
    }
  }
  return fallbackPosts;
}

export async function getPostBySlug(slug: string) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('relation "posts" does not exist')) {
          console.warn('Table "posts" not found or post not found');
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }
  }
  return null;
}

export async function getBlocksCount() {
  if (supabase) {
    try {
      const { count, error } = await supabase.from('page_blocks').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching blocks count:', error);
      return 0;
    }
  }
  return 0;
}

export async function deleteLead(id: string) {
  if (supabase) {
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting lead:', error);
      return false;
    }
  }
  return false;
}
