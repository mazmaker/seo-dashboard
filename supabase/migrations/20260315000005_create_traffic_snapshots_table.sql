-- Migration: Create traffic_snapshots table
-- Description: Historical Google Analytics 4 traffic data
-- Created: 2026-03-15

-- Create traffic_snapshots table
CREATE TABLE IF NOT EXISTS public.traffic_snapshots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,

    -- Snapshot date
    date date NOT NULL,

    -- Google Analytics 4 metrics
    sessions integer NOT NULL DEFAULT 0,
    users integer NOT NULL DEFAULT 0,
    new_users integer NOT NULL DEFAULT 0,
    pageviews integer NOT NULL DEFAULT 0,
    bounce_rate real,
    avg_session_duration real,

    -- Timestamp
    created_at timestamptz NOT NULL DEFAULT now(),

    -- Prevent duplicate snapshots for same client on same date
    CONSTRAINT traffic_snapshots_unique_constraint UNIQUE (client_id, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS traffic_snapshots_client_id_idx ON public.traffic_snapshots(client_id);
CREATE INDEX IF NOT EXISTS traffic_snapshots_date_idx ON public.traffic_snapshots(date);

-- Composite index for common query pattern (trend queries)
CREATE INDEX IF NOT EXISTS traffic_snapshots_client_date_idx
ON public.traffic_snapshots(client_id, date DESC);

-- Enable Row Level Security
ALTER TABLE public.traffic_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can access traffic snapshots via client ownership
CREATE POLICY "users_access_traffic_via_clients"
ON public.traffic_snapshots
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = traffic_snapshots.client_id
        AND clients.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = traffic_snapshots.client_id
        AND clients.user_id = auth.uid()
    )
);

-- Add comments for documentation
COMMENT ON TABLE public.traffic_snapshots IS 'Historical Google Analytics 4 traffic data captured daily';
COMMENT ON COLUMN public.traffic_snapshots.client_id IS 'Client this snapshot belongs to (FK to clients)';
COMMENT ON COLUMN public.traffic_snapshots.date IS 'Date of this snapshot (one per client per day)';
COMMENT ON COLUMN public.traffic_snapshots.bounce_rate IS 'Bounce rate (0-1, e.g., 0.45 = 45%)';
COMMENT ON COLUMN public.traffic_snapshots.avg_session_duration IS 'Average session duration in seconds';
