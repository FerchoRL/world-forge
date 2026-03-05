import type {
  ListUniversesQuery,
  PaginatedUniversesResponse,
  UniverseApiDTO,
  UniverseListItem,
  UniverseStatus,
} from '@/features/universe/types'

type MockUniverseRow = UniverseApiDTO & {
  type?: string
  stories?: number
  characters?: number
  updatedAt?: string
}

const MOCK_UNIVERSES: MockUniverseRow[] = [
  {
    id: 'uni-1',
    name: 'Shattered Realm',
    status: 'ACTIVE',
    premise: 'A fractured continent held together by ancient oaths.',
    type: 'Fantasy',
    stories: 3,
    characters: 24,
    updatedAt: '2026-01-31',
  },
  {
    id: 'uni-2',
    name: 'Neo Tokyo',
    status: 'ACTIVE',
    premise: 'Megacities where memory can be traded as currency.',
    type: 'Cyberpunk',
    stories: 2,
    characters: 15,
    updatedAt: '2026-01-29',
  },
  {
    id: 'uni-3',
    name: 'Quantum Wars',
    status: 'IN_DEVELOPMENT',
    premise: 'Parallel timelines collide in an endless tactical conflict.',
    type: 'Sci-Fi',
    stories: 1,
    characters: 8,
    updatedAt: '2026-01-27',
  },
  {
    id: 'uni-4',
    name: 'Eldergrove',
    status: 'ACTIVE',
    premise: 'A living forest where forgotten gods still answer prayers.',
    type: 'Fantasy',
    stories: 2,
    characters: 18,
    updatedAt: '2026-01-24',
  },
  {
    id: 'uni-5',
    name: 'Shadow Depths',
    status: 'DRAFT',
    premise: 'An abyssal world shaped by fear and old curses.',
    type: 'Horror',
    stories: 0,
    characters: 6,
    updatedAt: '2026-01-20',
  },
]

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
    if (options?.signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError')
    }

    const page = params.page ?? 1
    const limit = params.limit ?? 10
    const normalizedSearch = params.search?.trim().toLowerCase() ?? ''

    const filtered = MOCK_UNIVERSES.filter((universe) => {
      const statusMatches = !params.status || universe.status === params.status

      const searchMatches =
        normalizedSearch.length === 0 ||
        universe.name.toLowerCase().includes(normalizedSearch) ||
        universe.type?.toLowerCase().includes(normalizedSearch)

      return statusMatches && searchMatches
    })

    const start = (page - 1) * limit
    const end = start + limit
    const paginated = filtered.slice(start, end)

    return {
      universes: paginated.map((universe: UniverseApiDTO & {
        type?: string
        stories?: number
        characters?: number
        updatedAt?: string
      }): UniverseListItem => ({
        id: universe.id,
        name: universe.name,
        status: universe.status as UniverseStatus,
        type: universe.type,
        stories: universe.stories,
        characters: universe.characters,
        updatedAt: universe.updatedAt,
      })),
      page,
      limit,
      total: filtered.length,
    }
  },
}
