-- AdvR admin operations suite:
-- users/roles, editorial history, SEO, media, audit and lead follow-up.

CREATE TABLE IF NOT EXISTS public.admin_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Administrador',
  role TEXT NOT NULL DEFAULT 'editor'
    CHECK (role IN ('owner', 'editor', 'commercial', 'viewer')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bootstrap existing accounts. The oldest account becomes the owner.
INSERT INTO public.admin_profiles (user_id, name, role)
SELECT
  users.id,
  COALESCE(users.raw_user_meta_data ->> 'name', split_part(users.email, '@', 1), 'Administrador'),
  CASE
    WHEN users.created_at = (SELECT MIN(created_at) FROM auth.users) THEN 'owner'
    ELSE 'editor'
  END
FROM auth.users users
ON CONFLICT (user_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.current_admin_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.admin_profiles
  WHERE user_id = auth.uid() AND active = TRUE
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_admin_role() IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.can_manage_content()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.current_admin_role() IN ('owner', 'editor'), FALSE);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_leads()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.current_admin_role() IN ('owner', 'editor', 'commercial'), FALSE);
$$;

CREATE TABLE IF NOT EXISTS public.content_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  page_slug TEXT NOT NULL,
  blocks JSONB NOT NULL DEFAULT '[]'::JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  note TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS content_revisions_page_created_idx
  ON public.content_revisions (page_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS activity_log_created_idx
  ON public.activity_log (created_at DESC);

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS og_image_url TEXT,
  ADD COLUMN IF NOT EXISTS no_index BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  storage_path TEXT,
  alt_text TEXT,
  mime_type TEXT,
  size_bytes BIGINT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS telefone TEXT,
  ADD COLUMN IF NOT EXISTS interesse TEXT,
  ADD COLUMN IF NOT EXISTS origem TEXT DEFAULT 'site',
  ADD COLUMN IF NOT EXISTS pagina_origem TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS next_contact_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS internal_notes TEXT,
  ADD COLUMN IF NOT EXISTS last_contact_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE TABLE IF NOT EXISTS public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL DEFAULT 'note',
  content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_activities_lead_created_idx
  ON public.lead_activities (lead_id, created_at DESC);

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read profiles" ON public.admin_profiles;
CREATE POLICY "Admins can read profiles"
  ON public.admin_profiles FOR SELECT TO authenticated
  USING (public.is_active_admin());

DROP POLICY IF EXISTS "Owners can manage profiles" ON public.admin_profiles;
CREATE POLICY "Owners can manage profiles"
  ON public.admin_profiles FOR ALL TO authenticated
  USING (public.current_admin_role() = 'owner')
  WITH CHECK (public.current_admin_role() = 'owner');

DROP POLICY IF EXISTS "Admins can read revisions" ON public.content_revisions;
CREATE POLICY "Admins can read revisions"
  ON public.content_revisions FOR SELECT TO authenticated
  USING (public.is_active_admin());

DROP POLICY IF EXISTS "Content managers can create revisions" ON public.content_revisions;
CREATE POLICY "Content managers can create revisions"
  ON public.content_revisions FOR INSERT TO authenticated
  WITH CHECK (public.can_manage_content());

DROP POLICY IF EXISTS "Admins can read activity" ON public.activity_log;
CREATE POLICY "Admins can read activity"
  ON public.activity_log FOR SELECT TO authenticated
  USING (public.is_active_admin());

DROP POLICY IF EXISTS "Admins can create activity" ON public.activity_log;
CREATE POLICY "Admins can create activity"
  ON public.activity_log FOR INSERT TO authenticated
  WITH CHECK (public.is_active_admin());

DROP POLICY IF EXISTS "Public can read media library" ON public.media_library;
CREATE POLICY "Public can read media library"
  ON public.media_library FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Content managers can manage media" ON public.media_library;
CREATE POLICY "Content managers can manage media"
  ON public.media_library FOR ALL TO authenticated
  USING (public.can_manage_content())
  WITH CHECK (public.can_manage_content());

DROP POLICY IF EXISTS "Lead managers can manage activities" ON public.lead_activities;
CREATE POLICY "Lead managers can manage activities"
  ON public.lead_activities FOR ALL TO authenticated
  USING (public.can_manage_leads())
  WITH CHECK (public.can_manage_leads());

-- Public lead capture remains insert-only, while commercial users manage the CRM.
DROP POLICY IF EXISTS "Admins have full access to leads" ON public.leads;
CREATE POLICY "Lead managers have full access to leads"
  ON public.leads FOR ALL TO authenticated
  USING (public.can_manage_leads())
  WITH CHECK (public.can_manage_leads());

-- Tighten content write access without changing public reads.
DROP POLICY IF EXISTS "Admins have full access to pages" ON public.pages;
CREATE POLICY "Content managers have full access to pages"
  ON public.pages FOR ALL TO authenticated
  USING (public.can_manage_content())
  WITH CHECK (public.can_manage_content());

DROP POLICY IF EXISTS "Admins have full access to page_blocks" ON public.page_blocks;
CREATE POLICY "Content managers have full access to page_blocks"
  ON public.page_blocks FOR ALL TO authenticated
  USING (public.can_manage_content())
  WITH CHECK (public.can_manage_content());

DROP POLICY IF EXISTS "Admins have full access to global_settings" ON public.global_settings;
CREATE POLICY "Content managers have full access to global settings"
  ON public.global_settings FOR ALL TO authenticated
  USING (public.can_manage_content())
  WITH CHECK (public.can_manage_content());

DROP POLICY IF EXISTS "Admins have full access to posts" ON public.posts;
DROP POLICY IF EXISTS "Allow all for anon temporarily" ON public.posts;
CREATE POLICY "Content managers have full access to posts"
  ON public.posts FOR ALL TO authenticated
  USING (public.can_manage_content())
  WITH CHECK (public.can_manage_content());

DROP POLICY IF EXISTS "Admins have full access to depoimentos" ON public.depoimentos;
CREATE POLICY "Content managers have full access to testimonials"
  ON public.depoimentos FOR ALL TO authenticated
  USING (public.can_manage_content())
  WITH CHECK (public.can_manage_content());

DROP POLICY IF EXISTS "Admins have full access to novidades_linkedin" ON public.novidades_linkedin;
CREATE POLICY "Content managers have full access to linkedin news"
  ON public.novidades_linkedin FOR ALL TO authenticated
  USING (public.can_manage_content())
  WITH CHECK (public.can_manage_content());

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read media" ON storage.objects;
CREATE POLICY "Public can read media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Content managers can upload media" ON storage.objects;
CREATE POLICY "Content managers can upload media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.can_manage_content());

DROP POLICY IF EXISTS "Content managers can update media" ON storage.objects;
CREATE POLICY "Content managers can update media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.can_manage_content());

DROP POLICY IF EXISTS "Content managers can delete media" ON storage.objects;
CREATE POLICY "Content managers can delete media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.can_manage_content());

DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
CREATE POLICY "Content managers can upload logos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'logos' AND public.can_manage_content());
CREATE POLICY "Content managers can update logos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'logos' AND public.can_manage_content());
CREATE POLICY "Content managers can delete logos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'logos' AND public.can_manage_content());
