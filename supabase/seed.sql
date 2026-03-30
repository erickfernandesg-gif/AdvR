-- ### Arquivo: supabase/seed.sql

-- 1. Inserir ou Atualizar as Páginas (Garante que os IDs existam e evita erro de duplicata no slug)
INSERT INTO pages (slug, title) VALUES 
('/', 'Home - AdvR Engenharia de Remuneração'),
('/solucoes', 'Soluções - Motor Colossus')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

-- 2. Limpar blocos antigos apenas das páginas que estamos populando (Evita duplicatas e lixo)
DELETE FROM page_blocks 
WHERE page_id IN (SELECT id FROM pages WHERE slug IN ('/', '/solucoes'));

-- 3. Inserir Blocos da Home (Slug: '/')
WITH home_page AS (SELECT id FROM pages WHERE slug = '/')
INSERT INTO page_blocks (page_id, block_name, order_index, content) VALUES
((SELECT id FROM home_page), 'hero_section', 10, '{
  "title": "Engenharia de Remuneração Variável para a Elite Corporativa.",
  "subtitle": "Transformamos dados complexos em performance extraordinária com o Motor Colossus.",
  "primary_button": "Solicitar Demo Colossus",
  "secondary_button": "Conversa Estratégica",
  "image_url": "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80"
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
  "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
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
