-- Migration: Create keyword_snapshots table
-- Description: Historical keyword performance data from Google Search Console
-- Created: 2026-03-15

-- Create keyword_snapshots table
CREATE TABLE IF NOT EXISTS public.keyword_snapshots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,

    -- Snapshot data
    keyword text NOT NULL,
    date date NOT NULL,

    -- Google Search Console metrics
    position real,
    clicks integer NOT NULL DEFAULT 0,
    impressions integer NOT NULL DEFAULT 0,
    ctr real NOT NULL DEFAULT 0,

    -- Timestamp
    created_at timestamptz NOT NULL DEFAULT now(),

    -- Prevent duplicate snapshots for same keyword on same date
    CONSTRAINT keyword_snapshots_unique_constraint UNIQUE (client_id, keyword, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS keyword_snapshots_client_id_idx ON public.keyword_snapshots(client_id);
CREATE INDEX IF NOT EXISTS keyword_snapshots_date_idx ON public.keyword_snapshots(date);
CREATE INDEX IF NOT EXISTS keyword_snapshots_keyword_idx ON public.keyword_snapshots(keyword);

-- Composite index for common query pattern (trend queries)
CREATE INDEX IF NOT EXISTS keyword_snapshots_client_keyword_date_idx
ON public.keyword_snapshots(client_id, keyword, date DESC);

-- Enable Row Level Security
ALTER TABLE public.keyword_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can access snapshots via client ownership
CREATE POLICY "users_access_snapshots_via_clients"
ON public.keyword_snapshots
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = keyword_snapshots.client_id
        AND clients.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = keyword_snapshots.client_id
        AND clients.user_id = auth.uid()
    )
);

-- Add comments for documentation
COMMENT ON TABLE public.keyword_snapshots IS 'Historical keyword performance data captured daily from Google Search Console';
COMMENT ON COLUMN public.keyword_snapshots.client_id IS 'Client this snapshot belongs to (FK to clients)';
COMMENT ON COLUMN public.keyword_snapshots.date IS 'Date of this snapshot (one per keyword per day)';
COMMENT ON COLUMN public.keyword_snapshots.position IS 'Average search position (can be NULL if no data)';
COMMENT ON COLUMN public.keyword_snapshots.ctr IS 'Click-through rate (0-1, e.g., 0.05 = 5%)';
