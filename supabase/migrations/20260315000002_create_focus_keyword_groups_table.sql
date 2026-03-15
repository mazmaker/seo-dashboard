-- Migration: Create focus_keyword_groups table
-- Description: Groups for organizing focus keywords
-- Created: 2026-03-15

-- Create focus_keyword_groups table
CREATE TABLE IF NOT EXISTS public.focus_keyword_groups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,

    -- Group information
    name text NOT NULL,
    color text NOT NULL DEFAULT '#6B7280',

    -- Timestamp
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS focus_keyword_groups_client_id_idx ON public.focus_keyword_groups(client_id);

-- Enable Row Level Security
ALTER TABLE public.focus_keyword_groups ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can access groups via client ownership
CREATE POLICY "users_access_groups_via_clients"
ON public.focus_keyword_groups
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = focus_keyword_groups.client_id
        AND clients.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = focus_keyword_groups.client_id
        AND clients.user_id = auth.uid()
    )
);

-- Add comments for documentation
COMMENT ON TABLE public.focus_keyword_groups IS 'Groups for organizing focus keywords (e.g., Brand Keywords, Commercial Keywords)';
COMMENT ON COLUMN public.focus_keyword_groups.client_id IS 'Client this group belongs to (FK to clients)';
COMMENT ON COLUMN public.focus_keyword_groups.color IS 'Hex color code for UI categorization';
