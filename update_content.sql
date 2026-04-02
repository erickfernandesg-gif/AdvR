-- Script para atualizar e popular todas as páginas do site com imagens profissionais e links customizáveis

-- 1. Inserir ou Atualizar as Páginas
INSERT INTO pages (slug, title, description) VALUES 
('/', 'Home - AdvR Engenharia de Remuneração', 'Página principal da AdvR'),
('/solucoes', 'Soluções - Motor Colossus', 'Detalhes sobre o Motor Colossus e serviços'),
('/empresa', 'Empresa - Nossa História', 'Sobre a história e cultura da AdvR'),
('/portal', 'Portal de Incentivos', 'Plataforma Inteligente para sua força de vendas'),
('/blog', 'Insights & Blog', 'Artigos e novidades sobre remuneração variável'),
('/contato', 'Fale Conosco', 'Entre em contato com nossos especialistas')
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- 2. Limpar blocos antigos para garantir que a nova estrutura seja aplicada
DELETE FROM page_blocks;

-- 3. Inserir Blocos da Home (Slug: '/')
WITH home_page AS (SELECT id FROM pages WHERE slug = '/')
INSERT INTO page_blocks (page_id, block_name, order_index, content) VALUES
((SELECT id FROM home_page), 'hero_section', 10, '{
  "title": "Engenharia de Remuneração Variável para a Elite Corporativa.",
  "subtitle": "Transformamos dados complexos em performance extraordinária com o Motor Colossus.",
  "primary_button": "Solicitar Demo Colossus",
  "secondary_button": "Conversa Estratégica",
  "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
  "image_link": "/solucoes"
}'),
((SELECT id FROM home_page), 'highlight_card', 20, '{
  "title": "Motor Colossus: Da Ingestão ao Extrato em 24 Horas.*",
  "description": "Nossa engine proprietária processa volumes massivos de dados com precisão matemática, garantindo compliance e agilidade extrema.",
  "stat": "24h",
  "stat_label": "SLA de Processamento"
}'),
((SELECT id FROM home_page), 'solucoes_bento', 30, '{
  "title": "A Vitrine de Inteligência AdvR",
  "subtitle": "Soluções projetadas para Diretores e VPs que buscam transparência financeira e performance.",
  "cards": [
    {
      "id": "colossus",
      "title": "Colossus",
      "tag": "Compliance & Agilidade",
      "description": "Cálculo automatizado de premiação com garantia de entrega e segurança enterprise.",
      "icon": "calculate"
    },
    {
      "id": "portal",
      "title": "Portal de Incentivos",
      "tag": "Engajamento & Transparência",
      "description": "Plataforma completa para que sua equipe acompanhe extratos e metas em tempo real.",
      "icon": "dashboard"
    },
    {
      "id": "bi",
      "title": "BI Integration",
      "tag": "Insights em Tempo Real",
      "description": "Dashboards avançados que transformam dados de remuneração em decisões estratégicas.",
      "icon": "analytics"
    },
    {
      "id": "proativo",
      "title": "Gestão Proativa",
      "tag": "Análise Preditiva",
      "description": "Não apenas calculamos, antecipamos desafios e otimizamos resultados antes do fechamento.",
      "icon": "query_stats"
    }
  ]
}'),
((SELECT id FROM home_page), 'data_belt', 40, '{
  "title": "Esteira de Dados Inteligente",
  "steps": [
    {"label": "Integrar via API (ETL)", "icon": "api"},
    {"label": "Ponderar Regras", "icon": "rule"},
    {"label": "Calcular Cenários", "icon": "functions"},
    {"label": "Workflow de Aprovação", "icon": "fact_check"},
    {"label": "Entrega de Extratos", "icon": "send"}
  ]
}'),
((SELECT id FROM home_page), 'video_section', 50, '{
  "title": "ENTENDA O QUE JÁ FIZEMOS PARA AJUDAR NOSSOS CLIENTES",
  "video_id": "tgVis6b6ZfE",
  "description": "Veja como a AdvR transformou a gestão de remuneração para nossos clientes reais."
}'),
((SELECT id FROM home_page), 'social_proof', 60, '{
  "title": "Líderes de Mercado que Confiam na AdvR",
  "companies": ["PHARMACO", "LOGISTIX", "FINTECH_CO", "RETAIL_PRO", "CORP_GEN"]
}');

-- 4. Inserir Blocos da Página de Soluções (Slug: '/solucoes')
WITH solutions_page AS (SELECT id FROM pages WHERE slug = '/solucoes')
INSERT INTO page_blocks (page_id, block_name, order_index, content) VALUES
((SELECT id FROM solutions_page), 'hero_section', 10, '{
  "title": "O Motor Colossus. Tecnologia de Elite para Remuneração.",
  "subtitle": "Nossa tecnologia proprietária foi desenhada para lidar com a complexidade da remuneração variável de grandes corporações.",
  "primary_button": "Solicitar Demo",
  "secondary_button": "Ver Documentação",
  "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
  "image_link": ""
}'),
((SELECT id FROM solutions_page), 'pipeline_visual', 20, '{
  "title": "A Pipeline de Dados AdvR",
  "steps": [
    {"id": "01", "title": "Integrar API", "description": "Conexão direta com seu ERP ou CRM. Ingestão de dados segura.", "icon": "api"},
    {"id": "02", "title": "Ponderar Regras", "description": "Aplicação de pesos e critérios complexos de remuneração.", "icon": "rule"},
    {"id": "03", "title": "Calcular Cenários", "description": "Processamento em tempo real pelo Motor Colossus.", "icon": "calculate"},
    {"id": "04", "title": "Aprovar & Entregar", "description": "Workflow de aprovação e entrega de extratos.", "icon": "verified_user"}
  ]
}'),
((SELECT id FROM solutions_page), 'technical_focus', 30, '{
  "title": "Foco em Compliance & Segurança",
  "features": [
    {"title": "Criptografia de Ponta a Ponta", "description": "Seus dados financeiros protegidos.", "icon": "lock"},
    {"title": "Trilha de Auditoria Completa", "description": "Cada alteração de regra ou valor é registrada.", "icon": "history"},
    {"title": "Disponibilidade Enterprise", "description": "Infraestrutura escalável para milhões de registros.", "icon": "cloud_done"}
  ],
  "cta_title": "Por que o Colossus?",
  "cta_description": "Diferente de planilhas ou sistemas genéricos, o Colossus foi construído especificamente para as nuances do mercado brasileiro.",
  "cta_button": "Ver Demo Técnica"
}');

-- 5. Inserir Blocos da Página Empresa (Slug: '/empresa')
WITH empresa_page AS (SELECT id FROM pages WHERE slug = '/empresa')
INSERT INTO page_blocks (page_id, block_name, order_index, content) VALUES
((SELECT id FROM empresa_page), 'hero_section', 10, '{
  "title": "CREDIBILIDADE E CONFIANÇA É O QUE NOS MOVE HÁ 30 ANOS",
  "subtitle": "A Advanced Resources é uma empresa focada em soluções para gestão de resultados através de incentivos (remuneração variável), atuando no mercado há mais de 30 anos sempre de forma inovadora, utilizando metodologias modernas para entregar o melhor aos nossos clientes.",
  "primary_button": "Entre em Contato",
  "secondary_button": "Fale no WhatsApp",
  "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
  "image_link": "/contato"
}'),
((SELECT id FROM empresa_page), 'culture_section', 20, '{
  "title": "Inovação e Engajamento",
  "description": "Inovando com visões e facilitadores para engajar seu time de vendas com suas metas, onde eles estiverem, deixando seu sistema de RV transparente, flexível e potencializando seus resultados.",
  "tags": ["Transparência", "Flexibilidade", "Engajamento", "Inovação", "Metodologias Modernas"]
}'),
((SELECT id FROM empresa_page), 'contact_section', 30, '{
  "title": "Fale com nossos especialistas",
  "subtitle": "Estamos prontos para ajudar a sua empresa a alcançar novos resultados.",
  "email": "contato@advresources.com.br",
  "location": "São Paulo, SP - Brasil",
  "phone": "11 4123 9260",
  "whatsapp": "55 11 99388-8190",
  "form_title": "Envie uma mensagem",
  "form_button": "Enviar"
}');

-- 6. Inserir Blocos da Página Portal (Slug: '/portal')
WITH portal_page AS (SELECT id FROM pages WHERE slug = '/portal')
INSERT INTO page_blocks (page_id, block_name, order_index, content) VALUES
((SELECT id FROM portal_page), 'hero_section', 10, '{
  "title": "Portal de Incentivos. Transparência em Tempo Real.",
  "subtitle": "Engaje sua força de vendas com visibilidade total sobre metas, extratos e simuladores de premiação.",
  "primary_button": "Ver Demonstração",
  "secondary_button": "Funcionalidades",
  "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
  "image_link": ""
}'),
((SELECT id FROM portal_page), 'data_storytelling', 20, '{
  "stats": [
    {"value": "40", "suffix": "%", "label": "Aumento no Engajamento"},
    {"value": "0", "suffix": " Erros", "label": "Precisão Garantida"},
    {"value": "100", "suffix": "%", "label": "Transparência"}
  ]
}');

-- 7. Inserir Blocos da Página Blog (Slug: '/blog')
WITH blog_page AS (SELECT id FROM pages WHERE slug = '/blog')
INSERT INTO page_blocks (page_id, block_name, order_index, content) VALUES
((SELECT id FROM blog_page), 'hero_section', 10, '{
  "title": "Insights & Estratégia. O Futuro da Remuneração.",
  "subtitle": "Artigos, tendências e análises profundas sobre como otimizar a performance da sua equipe de vendas.",
  "primary_button": "Assinar Newsletter",
  "secondary_button": "Ver Artigos",
  "image_url": "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80",
  "image_link": ""
}'),
((SELECT id FROM blog_page), 'blog_highlight', 20, '{
  "title": "Últimos Insights",
  "posts": [
    {"title": "A Gestão Proativa na Remuneração Variável", "category": "Estratégia", "date": "17 Mar 2026", "link": "/blog-detalhes/gestao-proativa"},
    {"title": "Como o Motor Colossus Elimina Erros de Cálculo", "category": "Tecnologia", "date": "10 Mar 2026", "link": "/blog-detalhes/motor-colossus"},
    {"title": "Tendências de Incentivos para 2026", "category": "Mercado", "date": "05 Mar 2026", "link": "/blog-detalhes/tendencias-2026"}
  ]
}');

-- 8. Inserir Blocos da Página Contato (Slug: '/contato')
WITH contato_page AS (SELECT id FROM pages WHERE slug = '/contato')
INSERT INTO page_blocks (page_id, block_name, order_index, content) VALUES
((SELECT id FROM contato_page), 'hero_section', 10, '{
  "title": "Fale Conosco. Vamos Transformar seus Resultados.",
  "subtitle": "Nossa equipe de especialistas está pronta para entender seus desafios e propor a melhor solução em engenharia de remuneração.",
  "primary_button": "Preencher Formulário",
  "secondary_button": "Nossos Escritórios",
  "image_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80",
  "image_link": ""
}'),
((SELECT id FROM contato_page), 'contact_section', 20, '{
  "title": "Entre em Contato",
  "description": "Preencha o formulário abaixo e um de nossos consultores entrará em contato em até 24 horas.",
  "email": "contato@advr.com.br",
  "phone": "+55 11 9999-9999",
  "address": "Av. Paulista, 1000 - São Paulo, SP"
}');
-- Script para criar o bucket de uploads e configurar as políticas de segurança (RLS)

-- 1. Criar o bucket 'uploads' se ele não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permitir acesso público de leitura às imagens (necessário para exibir no site)
CREATE POLICY "Public Access Uploads" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'uploads');

-- 3. Permitir que usuários autenticados (admin) façam upload de imagens
CREATE POLICY "Authenticated Upload Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- 4. Permitir que usuários autenticados atualizem imagens
CREATE POLICY "Authenticated Update Uploads" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- 5. Permitir que usuários autenticados deletem imagens
CREATE POLICY "Authenticated Delete Uploads" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
