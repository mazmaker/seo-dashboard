/**
 * Common Types
 */

import type { Database } from './database.types'

// Database table types
export type Client = Database['public']['Tables']['clients']['Row']
export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type ClientUpdate = Database['public']['Tables']['clients']['Update']

export type FocusKeywordGroup = Database['public']['Tables']['focus_keyword_groups']['Row']
export type FocusKeywordGroupInsert = Database['public']['Tables']['focus_keyword_groups']['Insert']
export type FocusKeywordGroupUpdate = Database['public']['Tables']['focus_keyword_groups']['Update']

export type FocusKeyword = Database['public']['Tables']['focus_keywords']['Row']
export type FocusKeywordInsert = Database['public']['Tables']['focus_keywords']['Insert']
export type FocusKeywordUpdate = Database['public']['Tables']['focus_keywords']['Update']

export type KeywordSnapshot = Database['public']['Tables']['keyword_snapshots']['Row']
export type KeywordSnapshotInsert = Database['public']['Tables']['keyword_snapshots']['Insert']
export type KeywordSnapshotUpdate = Database['public']['Tables']['keyword_snapshots']['Update']

export type TrafficSnapshot = Database['public']['Tables']['traffic_snapshots']['Row']
export type TrafficSnapshotInsert = Database['public']['Tables']['traffic_snapshots']['Insert']
export type TrafficSnapshotUpdate = Database['public']['Tables']['traffic_snapshots']['Update']
