import { UniverseId, UniverseRepository } from '@world-forge/domain'

import { GetUniverseByIdResponse } from '../../dtos/universe/get-universe-by-id.response'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { NotFoundError } from '../../errors/not-found.error'
import { ValidationError } from '../../errors/validation.error'
import { UniverseMapper } from '../../mappers/universe.mapper'

export class GetUniverseByIdService {
  constructor(private readonly repository: UniverseRepository) {}

  async execute(id: UniverseId): Promise<GetUniverseByIdResponse> {
    if (typeof id !== 'string' || id.trim() === '') {
      throw new ValidationError('Universe id is required')
    }

    const result = await this.repository.getById(id)

    if (!result.ok) {
      throw mapRepoErrorToAppError(result.error)
    }

    if (!result.data) {
      throw new NotFoundError(`Universe ${id} not found`)
    }

    return { universe: UniverseMapper.toDTO(result.data) }
  }
}
