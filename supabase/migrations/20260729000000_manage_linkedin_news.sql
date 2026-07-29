-- Permite que administradores autenticados gerenciem as novidades.
CREATE POLICY "Admins have full access to novidades_linkedin"
ON public.novidades_linkedin
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Remove duplicidades exatas existentes, mantendo o registro mais recente.
DELETE FROM public.novidades_linkedin older
USING public.novidades_linkedin newer
WHERE older.url_postagem IS NOT NULL
  AND older.url_postagem = newer.url_postagem
  AND (
    older.criado_em < newer.criado_em
    OR (older.criado_em = newer.criado_em AND older.id::text < newer.id::text)
  );

-- Impede que o mesmo link seja cadastrado novamente.
CREATE UNIQUE INDEX IF NOT EXISTS novidades_linkedin_url_postagem_unique
ON public.novidades_linkedin (url_postagem)
WHERE url_postagem IS NOT NULL;
