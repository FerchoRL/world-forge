import { httpClient } from '@/app/api/httpClient'
import type {
  UniverseApiDTO,
  ListUniversesApiResponse,
  ListUniversesQuery,
  UniverseListItem,
  PaginatedUniversesResponse,
} from '@/features/universe/types'

/**
 * ===== Service =====
 * Traduce backend → frontend
 * NO conoce UI
 * NO conoce estado
 */
export const universeService = {
  async getAll(
    params: ListUniversesQuery,
    options?: { signal?: AbortSignal }
  ): Promise<PaginatedUniversesResponse> {
    const query = new URLSearchParams()

    if (params.page !== undefined) {
      query.set('page', String(params.page))
    }
    if (params.limit !== undefined) {
      query.set('limit', String(params.limit))
    }
    if (params.search && params.search.trim().length > 0) {
      query.set('search', params.search.trim())
    }
    if (params.status) {
      query.set('status', params.status)
    }

    const response = await httpClient.get<ListUniversesApiResponse>(
      `/universes?${query.toString()}`,
      { signal: options?.signal }
    )

    return {
      universes: response.universes.map((universe: UniverseApiDTO) => ({
        id: universe.id,
        name: universe.name,
        status: universe.status,
        premise: universe.premise,
        rules: universe.rules,
        notes: universe.notes,
      })),
      page: response.page,
      limit: response.limit,
      total: response.total,
    }
  },
// ...existing code...
}
