-- Migration: Create focus_keywords table
-- Description: Keywords that users actively monitor
-- Created: 2026-03-15

-- Create focus_keywords table
CREATE TABLE IF NOT EXISTS public.focus_keywords (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid NOT NULL REFERENCES public.focus_keyword_groups(id) ON DELETE CASCADE,

    -- Keyword information
    keyword text NOT NULL,
    target_position integer,
    priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    notes text,

    -- Timestamp
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS focus_keywords_group_id_idx ON public.focus_keywords(group_id);
CREATE INDEX IF NOT EXISTS focus_keywords_keyword_idx ON public.focus_keywords(keyword);

-- Enable Row Level Security
ALTER TABLE public.focus_keywords ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can access keywords via group → client chain
CREATE POLICY "users_access_keywords_via_groups"
ON public.focus_keywords
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.focus_keyword_groups fkg
        JOIN public.clients c ON c.id = fkg.client_id
        WHERE fkg.id = focus_keywords.group_id
        AND c.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.focus_keyword_groups fkg
        JOIN public.clients c ON c.id = fkg.client_id
        WHERE fkg.id = focus_keywords.group_id
        AND c.user_id = auth.uid()
    )
);

-- Add comments for documentation
COMMENT ON TABLE public.focus_keywords IS 'Keywords that users actively track and monitor';
COMMENT ON COLUMN public.focus_keywords.group_id IS 'Group this keyword belongs to (FK to focus_keyword_groups)';
COMMENT ON COLUMN public.focus_keywords.target_position IS 'Desired ranking position (optional goal)';
COMMENT ON COLUMN public.focus_keywords.priority IS 'Keyword importance: high, medium, or low';
