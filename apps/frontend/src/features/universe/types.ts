export type UniverseStatus =
  | 'ACTIVE'
  | 'IN_DEVELOPMENT'
  | 'DRAFT'
  | 'ARCHIVED'

export type UniverseStatusFilter = UniverseStatus | 'ALL'

export interface UniverseApiDTO {
  id: string
  name: string
  status: UniverseStatus
  premise: string
  rules?: string[]
  notes?: string
}

export interface ListUniversesApiResponse {
  universes: UniverseApiDTO[]
  page: number
  limit: number
  total: number
}

export interface ListUniversesQuery {
  page?: number
  limit?: number
  search?: string
  status?: UniverseStatus
}

export interface UniverseListItem {
  id: string
  name: string
  status: UniverseStatus
  type?: string
  stories?: number
  characters?: number
  updatedAt?: string
}

export interface PaginatedUniversesResponse {
  universes: UniverseListItem[]
  page: number
  limit: number
  total: number
}
