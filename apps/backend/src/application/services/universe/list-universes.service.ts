import { UniverseRepository } from '@world-forge/domain'

import {
  ListUniversesQuery,
  ListUniversesResponse,
} from '../../dtos/universe/list-universes.response'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { ValidationError } from '../../errors/validation.error'
import { UniverseMapper } from '../../mappers/universe.mapper'

export class ListUniversesService {
  private static readonly MAX_SEARCH_LENGTH = 120

  constructor(private readonly repository: UniverseRepository) {}

  async execute(query?: ListUniversesQuery): Promise<ListUniversesResponse> {
    const rawPage = query?.page
    const rawLimit = query?.limit
    const rawSearch = query?.search
    const rawStatus = query?.status

    if (rawPage !== undefined && (!Number.isInteger(rawPage) || rawPage < 1)) {
      throw new ValidationError('Page must be a positive integer')
    }

    if (rawLimit !== undefined && (!Number.isInteger(rawLimit) || rawLimit < 1)) {
      throw new ValidationError('Limit must be a positive integer')
    }

    if (rawSearch !== undefined && typeof rawSearch !== 'string') {
      throw new ValidationError('Search must be a string')
    }

    const page = typeof rawPage === 'number' ? rawPage : 1
    const limit = typeof rawLimit === 'number' ? Math.min(rawLimit, 50) : 10

    const normalizedSearch =
      typeof rawSearch === 'string'
        ? rawSearch.trim().replace(/\s+/g, ' ')
        : ''

    if (normalizedSearch.length > ListUniversesService.MAX_SEARCH_LENGTH) {
      throw new ValidationError(
        `Search must be at most ${ListUniversesService.MAX_SEARCH_LENGTH} characters`
      )
    }

    const search = normalizedSearch.length > 0 ? normalizedSearch : undefined

    if (
      rawStatus !== undefined &&
      rawStatus !== 'DRAFT' &&
      rawStatus !== 'ACTIVE' &&
      rawStatus !== 'ARCHIVED'
    ) {
      throw new ValidationError('Status must be DRAFT, ACTIVE or ARCHIVED')
    }

    const status = rawStatus

    const result = await this.repository.list({
      page,
      limit,
      search,
      status,
    })

    if (!result.ok) {
      throw mapRepoErrorToAppError(result.error)
    }

    return {
      universes: result.data.items.map(UniverseMapper.toDTO),
      page,
      limit,
      total: result.data.total,
    }
  }
}
