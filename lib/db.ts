import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcrdgnwpjtpvhcvxzswp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_rBtJizSXa1MeJlzrbtDqMw_vDUDAq2H';

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

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

export async function getPageBlocks(slug: string) {
  if (slug === '/empresa') {
    return [
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
  }

  if (supabase) {
    const { data: page } = await supabase.from('pages').select('id').eq('slug', slug).single();
    if (page) {
      const { data: blocks } = await supabase.from('page_blocks').select('*').eq('page_id', page.id).order('order_index');
      if (blocks && blocks.length > 0) return blocks;
    }
  }
  
  if (slug === '/') {
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
          post: {
            title: 'A Gestão Proativa na Remuneração Variável',
            excerpt: 'Como antecipar desafios e otimizar resultados através da análise preditiva e feedback contínuo.',
            category: 'Suporte Proativo',
            slug: 'suporte-proativo'
          }
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
    return [
      {
        block_name: 'hero_section',
        content: {
          title: 'Insights de Elite',
          subtitle: 'Explorando a intersecção entre tecnologia, precisão matemática e performance humana na remuneração variável.',
          primary_button: 'Assinar Newsletter',
          secondary_button: 'Ver Categorias',
          image_url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80',
          image_link: ''
        }
      },
      {
        block_name: 'blog_highlight',
        content: {
          title: 'Destaque do Mês',
          subtitle: 'O artigo mais lido pela nossa comunidade de diretores.',
          post: {
            title: 'A Gestão Proativa na Remuneração Variável',
            excerpt: 'Como antecipar desafios e otimizar resultados através da análise preditiva e feedback contínuo.',
            category: 'Suporte Proativo',
            slug: 'suporte-proativo'
          }
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
