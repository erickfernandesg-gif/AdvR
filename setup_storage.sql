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
