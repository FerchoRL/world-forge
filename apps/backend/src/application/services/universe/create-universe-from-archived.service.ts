import { UniverseId, UniverseRepository } from '@world-forge/domain'

import { CreateUniverseFromArchivedResponse } from '../../dtos/universe/create-universe-from-archived.response'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { NotFoundError } from '../../errors/not-found.error'
import { ValidationError } from '../../errors/validation.error'
import { IdGenerator } from '../../ids/id-generator'
import { UniverseMapper } from '../../mappers/universe.mapper'
import { validateUniverseCoreInput } from '../../validators/universe-core.validator'

export class CreateUniverseFromArchivedService {
    constructor(
        private readonly repository: UniverseRepository,
        private readonly idGenerator: IdGenerator
    ) { }

    async execute(sourceUniverseId: UniverseId): Promise<CreateUniverseFromArchivedResponse> {
        if (typeof sourceUniverseId !== 'string' || sourceUniverseId.trim() === '') {
            throw new ValidationError('Source universe id is required')
        }

        const sourceResult = await this.repository.getById(sourceUniverseId)

        if (!sourceResult.ok) {
            throw mapRepoErrorToAppError(sourceResult.error)
        }

        if (!sourceResult.data) {
            throw new NotFoundError(`Universe ${sourceUniverseId} not found`)
        }

        if (sourceResult.data.status !== 'ARCHIVED') {
            throw new ValidationError('Only ARCHIVED universes can be used as source')
        }

        const name = sourceResult.data.name
        const premise = sourceResult.data.premise
        const rules = sourceResult.data.rules
        const notes = sourceResult.data.notes

        validateUniverseCoreInput({
            name,
            premise,
            rules,
            notes,
        })

        const newId = this.idGenerator.generateUniverseId()

        const createResult = await this.repository.create({
            id: newId,
            name,
            premise,
            rules,
            notes,
            status: 'DRAFT',
        })

        if (!createResult.ok) {
            throw mapRepoErrorToAppError(createResult.error)
        }

        return {
            universe: UniverseMapper.toDTO(createResult.data),
        }
    }
}