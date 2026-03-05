import { UniverseRepository } from '@world-forge/domain'

import {
  ListUniversesQuery,
  ListUniversesResponse,
} from '../../dtos/universe/list-universes.response'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { ValidationError } from '../../errors/validation.error'
import { UniverseMapper } from '../../mappers/universe.mapper'

export class ListUniversesService {
  constructor(private readonly repository: UniverseRepository) {}

  async execute(query?: ListUniversesQuery): Promise<ListUniversesResponse> {
    const rawPage = query?.page
    const rawLimit = query?.limit

    if (rawPage !== undefined && (!Number.isInteger(rawPage) || rawPage < 1)) {
      throw new ValidationError('Page must be a positive integer')
    }

    if (rawLimit !== undefined && (!Number.isInteger(rawLimit) || rawLimit < 1)) {
      throw new ValidationError('Limit must be a positive integer')
    }

    const page = typeof rawPage === 'number' ? rawPage : 1
    const limit = typeof rawLimit === 'number' ? Math.min(rawLimit, 50) : 10

    const result = await this.repository.list()

    if (!result.ok) {
      throw mapRepoErrorToAppError(result.error)
    }

    const total = result.data.length
    const start = (page - 1) * limit
    const end = start + limit

    return {
      universes: result.data.slice(start, end).map(UniverseMapper.toDTO),
      page,
      limit,
      total,
    }
  }
}
