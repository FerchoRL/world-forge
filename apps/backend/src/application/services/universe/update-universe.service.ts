import { UniverseId, UniverseRepository } from '@world-forge/domain'

import { UpdateUniverseRequest } from '../../dtos/universe/update-universe.request'
import { UpdateUniverseResponse } from '../../dtos/universe/update-universe.response'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { ValidationError } from '../../errors/validation.error'
import { UniverseMapper } from '../../mappers/universe.mapper'
import {
  validateUniverseName,
  validateUniverseNotes,
  validateUniversePremise,
  validateUniverseRules,
} from '../../validators/universe-core.validator'

export class UpdateUniverseService {
  constructor(private readonly repository: UniverseRepository) {}

  async execute(
    id: UniverseId,
    patch: UpdateUniverseRequest
  ): Promise<UpdateUniverseResponse> {
    if (typeof id !== 'string' || id.trim() === '') {
      throw new ValidationError('Universe id is required')
    }

    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
      throw new ValidationError('Patch must be a valid object')
    }

    const allowedFields = ['name', 'premise', 'rules', 'notes'] as const
    const patchKeys = Object.keys(patch)

    if (patchKeys.length === 0) {
      throw new ValidationError('Patch must include at least one updatable field')
    }

    const invalidFields = patchKeys.filter(
      (key) => !allowedFields.includes(key as (typeof allowedFields)[number])
    )

    if (invalidFields.length > 0) {
      throw new ValidationError(
        `Patch contains unsupported fields: ${invalidFields.join(', ')}`
      )
    }

    if ('name' in patch) {
      validateUniverseName(patch.name)
    }

    if ('premise' in patch) {
      validateUniversePremise(patch.premise)
    }

    if ('rules' in patch) {
      validateUniverseRules(patch.rules)
    }

    if ('notes' in patch && patch.notes !== undefined) {
      validateUniverseNotes(patch.notes)
    }

    const result = await this.repository.updateCore(
      id,
      UniverseMapper.toUpdatePatch(patch)
    )

    if (!result.ok) {
      throw mapRepoErrorToAppError(result.error)
    }

    return {
      universe: UniverseMapper.toDTO(result.data),
    }
  }
}
