-- Create tables
CREATE TABLE global_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address TEXT,
    phone_number TEXT,
    email_contact TEXT,
    google_analytics_id TEXT,
    custom_script_head TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE page_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    block_name TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    empresa TEXT,
    cargo TEXT,
    mensagem TEXT,
    status TEXT DEFAULT 'novo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial data
INSERT INTO global_settings (address, phone_number, email_contact, google_analytics_id)
VALUES ('Av. Paulista, 1000 - São Paulo, SP', '+55 11 9999-9999', 'contato@advr.com.br', 'G-1234567890');

INSERT INTO pages (id, slug, title, meta_description)
VALUES ('11111111-1111-1111-1111-111111111111', '/', 'Home - AdvR', 'Soluções de Remuneração Variável Estratégica');

INSERT INTO page_blocks (page_id, block_name, content, order_index)
VALUES 
('11111111-1111-1111-1111-111111111111', 'hero_section', '{"badge": "30 Anos de Expertise", "title_part1": "Sua Remuneração Variável", "title_highlight": "Estratégica.", "subtitle": "A AdvR transforma modelos complexos em vantagem competitiva com tecnologia de ponta para Premiação de Vendas.", "primary_button": "Solicitar Demonstração", "secondary_button": "Nossas Soluções", "image_url": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"}', 0),
('11111111-1111-1111-1111-111111111111', 'social_proof', '{"title": "Confiança de Líderes Globais", "companies": ["PHARMACO", "LOGISTIX", "FINTECH_CO", "RETAIL_PRO", "CORP_GEN"]}', 1),
('11111111-1111-1111-1111-111111111111', 'solutions', '{"title": "Soluções Corporativas", "cards": [{"icon": "calculate", "title": "Cálculo de Remuneração Variável", "description": "Automatize cálculos complexos com precisão absoluta. Elimine erros manuais e garanta transparência total em cada ciclo de pagamento.", "link_text": "Ver detalhes"}, {"icon": "military_tech", "title": "Premiação de Vendas", "description": "Motive suas equipes com sistemas de recompensas inteligentes. Vincule metas de negócio a incentivos reais de forma dinâmica.", "link_text": "Ver detalhes"}, {"icon": "analytics", "title": "Dashboards e Relatórios", "description": "Insights visuais em tempo real para tomada de decisão. Acompanhe a performance da força de vendas através de KPIs customizáveis.", "link_text": "Ver detalhes"}]}', 2),
('11111111-1111-1111-1111-111111111111', 'expertise', '{"image_url": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80", "years": "30+", "years_text": "Anos de Sucesso", "title": "Expertise que gera confiança.", "description": "Desde nossa fundação, focamos em resolver um dos maiores desafios corporativos: como remunerar com justiça, transparência e impacto estratégico. Nosso suporte local e profundo conhecimento técnico garantem implementações sem fricção.", "features": [{"icon": "verified", "title": "Suporte Local Personalizado", "description": "Especialistas prontos para atender sua realidade de mercado."}, {"icon": "security", "title": "Compliance & Auditoria", "description": "Sistemas preparados para as mais rigorosas auditorias internacionais."}], "button_text": "Nossa História"}', 3),
('11111111-1111-1111-1111-111111111111', 'cta', '{"title": "Pronto para elevar sua estratégia de vendas?", "subtitle": "Fale com nossos consultores e descubra como a AdvR pode transformar sua operação de remuneração variável.", "button_text": "Agendar Demonstração Gratuita"}', 4);

-- Set up Row Level Security (RLS)
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read global_settings" ON global_settings FOR SELECT USING (true);
CREATE POLICY "Public can read pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Public can read page_blocks" ON page_blocks FOR SELECT USING (true);

-- Public can insert leads
CREATE POLICY "Public can insert leads" ON leads FOR INSERT WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admins have full access to global_settings" ON global_settings USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to pages" ON pages USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to page_blocks" ON page_blocks USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to leads" ON leads USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');