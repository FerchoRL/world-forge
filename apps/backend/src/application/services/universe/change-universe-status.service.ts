import {
  canTransitionUniverseStatus,
  UniverseId,
  UniverseRepository,
} from '@world-forge/domain'

import { ChangeUniverseStatusResponse } from '../../dtos/universe/change-universe-status.response'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { NotFoundError } from '../../errors/not-found.error'
import { ValidationError } from '../../errors/validation.error'
import { UniverseMapper } from '../../mappers/universe.mapper'

export class ChangeUniverseStatusService {
  constructor(private readonly repository: UniverseRepository) {}

  async execute(
    id: UniverseId,
    status: 'ACTIVE' | 'ARCHIVED'
  ): Promise<ChangeUniverseStatusResponse> {
    if (typeof id !== 'string' || id.trim() === '') {
      throw new ValidationError('Universe id is required')
    }

    if (status !== 'ACTIVE' && status !== 'ARCHIVED') {
      throw new ValidationError('Status must be ACTIVE or ARCHIVED')
    }

    const currentResult = await this.repository.getById(id)

    if (!currentResult.ok) {
      throw mapRepoErrorToAppError(currentResult.error)
    }

    if (!currentResult.data) {
      throw new NotFoundError(`Universe ${id} not found`)
    }

    if (!canTransitionUniverseStatus(currentResult.data.status, status)) {
      throw new ValidationError(
        `Status transition ${currentResult.data.status} -> ${status} is not allowed`
      )
    }

    const result = await this.repository.changeStatus(id, status)

    if (!result.ok) {
      throw mapRepoErrorToAppError(result.error)
    }

    return {
      universe: UniverseMapper.toDTO(result.data),
    }
  }
}
