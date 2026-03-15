-- Migration: Create clients table
-- Description: Stores client websites tracked by users
-- Created: 2026-03-15

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Client information
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    website text,

    -- Branding
    logo_url text,
    theme_color text DEFAULT '#3B82F6',

    -- API Configuration
    gsc_site_url text,
    ga4_property_id text,

    -- Status
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused')),

    -- Contract information
    contract_start date,
    contract_end date,

    -- Notes
    notes text,

    -- Timestamps
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS clients_slug_idx ON public.clients(slug);
CREATE INDEX IF NOT EXISTS clients_status_idx ON public.clients(status);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own clients
CREATE POLICY "users_access_own_clients"
ON public.clients
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to auto-update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.clients IS 'Client websites tracked by users in the SEO dashboard';
COMMENT ON COLUMN public.clients.user_id IS 'Owner of this client (FK to auth.users)';
COMMENT ON COLUMN public.clients.slug IS 'URL-friendly identifier for client (used in routes)';
COMMENT ON COLUMN public.clients.gsc_site_url IS 'Google Search Console site URL';
COMMENT ON COLUMN public.clients.ga4_property_id IS 'Google Analytics 4 property ID';
