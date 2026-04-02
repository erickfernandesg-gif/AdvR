-- Criação da tabela de depoimentos
CREATE TABLE public.depoimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    empresa TEXT,
    texto TEXT NOT NULL,
    img_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativa a segurança em nível de linha (RLS)
ALTER TABLE public.depoimentos ENABLE ROW LEVEL SECURITY;

-- Permite que qualquer pessoa leia os depoimentos (necessário para exibir no site público)
CREATE POLICY "Permitir leitura pública de depoimentos" ON public.depoimentos
    FOR SELECT USING (true);

-- Permite que administradores gerenciem os depoimentos
CREATE POLICY "Admins have full access to depoimentos" ON public.depoimentos 
    USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

-- Inserir dados de exemplo (opcional)
INSERT INTO public.depoimentos (nome, empresa, texto, img_url)
VALUES 
('Carlos Silva', 'Diretor de Vendas, TechCorp', 'A implementação do Motor Colossus transformou completamente a forma como gerenciamos as comissões. A transparência e a precisão dos cálculos aumentaram a motivação da equipe de vendas em 40% no primeiro trimestre.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'),
('Mariana Costa', 'CHRO, Global Retail', 'A AdvR não entregou apenas um software, mas uma consultoria estratégica que redefiniu nossos modelos de incentivo. O suporte local e o profundo conhecimento técnico foram fundamentais para o sucesso do projeto.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'),
('Roberto Almeida', 'CFO, Logistix Brasil', 'A capacidade de auditar cada centavo pago em remuneração variável nos deu uma segurança jurídica e financeira sem precedentes. O sistema é robusto e perfeitamente adaptado à complexidade da nossa operação.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200');
