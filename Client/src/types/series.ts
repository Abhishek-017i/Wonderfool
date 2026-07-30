// Shared Series type matching the MongoDB schema
// Used by Browse, SeriesDetail, SeriesCard, SearchBar, etc.

export interface SeriesTitle {
  romaji?: string
  english?: string
  native?: string
}

export interface SeriesCharacter {
  name: string
  photo?: string
  role: 'MAIN' | 'SUPPORTING'
}

export interface SeriesStaffMember {
  personId?: {
    _id: string
    name: string
    photo?: string
    [key: string]: unknown
  }
  designation?: string
}

export interface SeriesAdaptation {
  seriesId?: {
    _id: string
    title: SeriesTitle
    coverImage?: string
    type?: string
    [key: string]: unknown
  }
  relationType?: string
}

export interface Series {
  _id: string
  title: SeriesTitle
  type: 'ANIME' | 'MANGA' | 'NOVEL'
  countryOfOrigin?: 'JP' | 'KR' | 'CN' | 'TW'
  synopsis?: string
  genres: string[]
  status?: 'ongoing' | 'finished' | 'hiatus' | 'cancelled'
  startDate?: string
  endDate?: string
  episodeCount?: number
  chapterCount?: number
  volumeCount?: number
  coverImage?: string
  bannerImage?: string
  characters: SeriesCharacter[]
  staff: SeriesStaffMember[]
  adaptations: SeriesAdaptation[]
  aniListId?: number
  createdAt?: string
  updatedAt?: string
}

export interface PaginatedSeriesResponse {
  series: Series[]
  total: number
  page: number
  totalPages: number
}
