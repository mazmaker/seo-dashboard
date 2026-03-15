/**
 * Database Types
 *
 * This file contains TypeScript types for the Supabase database schema.
 * Types are manually defined based on knowledge/database-schema.md
 *
 * Future: Can be auto-generated using Supabase CLI:
 * ```bash
 * supabase gen types typescript --project-id your-project-id > types/database.types.ts
 * ```
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          website: string | null
          logo_url: string | null
          theme_color: string
          gsc_site_url: string | null
          ga4_property_id: string | null
          status: 'active' | 'inactive' | 'paused'
          contract_start: string | null
          contract_end: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          website?: string | null
          logo_url?: string | null
          theme_color?: string
          gsc_site_url?: string | null
          ga4_property_id?: string | null
          status?: 'active' | 'inactive' | 'paused'
          contract_start?: string | null
          contract_end?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          website?: string | null
          logo_url?: string | null
          theme_color?: string
          gsc_site_url?: string | null
          ga4_property_id?: string | null
          status?: 'active' | 'inactive' | 'paused'
          contract_start?: string | null
          contract_end?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      focus_keyword_groups: {
        Row: {
          id: string
          client_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      focus_keywords: {
        Row: {
          id: string
          group_id: string
          keyword: string
          target_position: number | null
          priority: 'high' | 'medium' | 'low'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          keyword: string
          target_position?: number | null
          priority?: 'high' | 'medium' | 'low'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          keyword?: string
          target_position?: number | null
          priority?: 'high' | 'medium' | 'low'
          notes?: string | null
          created_at?: string
        }
      }
      keyword_snapshots: {
        Row: {
          id: string
          client_id: string
          keyword: string
          date: string
          position: number | null
          clicks: number
          impressions: number
          ctr: number
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          keyword: string
          date: string
          position?: number | null
          clicks?: number
          impressions?: number
          ctr?: number
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          keyword?: string
          date?: string
          position?: number | null
          clicks?: number
          impressions?: number
          ctr?: number
          created_at?: string
        }
      }
      traffic_snapshots: {
        Row: {
          id: string
          client_id: string
          date: string
          sessions: number
          users: number
          new_users: number
          pageviews: number
          bounce_rate: number | null
          avg_session_duration: number | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          date: string
          sessions?: number
          users?: number
          new_users?: number
          pageviews?: number
          bounce_rate?: number | null
          avg_session_duration?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          date?: string
          sessions?: number
          users?: number
          new_users?: number
          pageviews?: number
          bounce_rate?: number | null
          avg_session_duration?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
