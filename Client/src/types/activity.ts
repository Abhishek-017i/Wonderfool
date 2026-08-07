export type ActionType = 'completed' | 'started' | 'rated' | 'reviewed' | 'added_note'

export type MediaType = 'anime' | 'manga' | 'light-novel'

export interface ActivityEntry {
  id: string
  seriesId: string
  seriesTitle: string
  coverUrl: string
  mediaType: MediaType
  actionType: ActionType
  actionLabel: string
  progress?: {
    current: number
    total: number
  }
  note?: string
  date: Date
  time: string
}

export type QuickFilter = 'all' | 'completed' | 'in-progress' | 'rated' | 'reviewed'

export interface FilterState {
  activeFilter: QuickFilter
  mediaTypeFilter: 'all' | MediaType
  dateRangeFilter: 'all' | 'week' | 'month' | '3months'
}
