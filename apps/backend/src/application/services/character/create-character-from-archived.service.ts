import { CharacterId, CharacterRepository } from '@world-forge/domain'
import { IdGenerator } from '../../ids/id-generator'
import { ValidationError } from '../../errors/validation.error'
import { NotFoundError } from '../../errors/not-found.error'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { CharacterMapper } from '../../mappers/character.mapper'
import { CreateCharacterFromArchivedRequest } from '../../dtos/character/create-character-from-archived.request'
import { CreateCharacterFromArchivedResponse } from '../../dtos/character/create-character-from-archived.response'
import { validateCharacterCoreInput } from '../../validators/character-core.validator'

export class CreateCharacterFromArchivedService {
    constructor(
        private readonly repository: CharacterRepository,
        private readonly idGenerator: IdGenerator
    ) {}

    async execute(
        sourceCharacterId: CharacterId,
        input?: CreateCharacterFromArchivedRequest
    ): Promise<CreateCharacterFromArchivedResponse> {
        if (typeof sourceCharacterId !== 'string' || sourceCharacterId.trim() === '') {
            throw new ValidationError('Source character id is required')
        }

        const sourceResult = await this.repository.getById(sourceCharacterId)

        if (!sourceResult.ok) {
            throw mapRepoErrorToAppError(sourceResult.error)
        }

        if (!sourceResult.data) {
            throw new NotFoundError(`Character ${sourceCharacterId} not found`)
        }

        if (sourceResult.data.status !== 'ARCHIVED') {
            throw new ValidationError('Only ARCHIVED characters can be used as source')
        }

        const status = input?.status ?? 'DRAFT'
        if (status !== 'DRAFT' && status !== 'ACTIVE') {
            throw new ValidationError(`Status ${status} is not valid. Allowed values: DRAFT | ACTIVE`)
        }

        const name = input?.name ?? sourceResult.data.name
        const identity = input?.identity ?? sourceResult.data.identity
        const categories = input?.categories ?? sourceResult.data.categories
        const inspirations = input?.inspirations ?? sourceResult.data.inspirations
        const notes = input?.notes ?? sourceResult.data.notes
        const image = input?.image ?? sourceResult.data.image

        validateCharacterCoreInput({
            name,
            identity,
            categories,
            inspirations,
            notes,
            image,
        })

        const newId = this.idGenerator.generateCharacterId()

        const createResult = await this.repository.create({
            id: newId,
            name,
            identity,
            categories,
            inspirations,
            notes,
            image,
            status,
        })

        if (!createResult.ok) {
            throw mapRepoErrorToAppError(createResult.error)
        }

        return {
            character: CharacterMapper.toDTO(createResult.data),
        }
    }
}
