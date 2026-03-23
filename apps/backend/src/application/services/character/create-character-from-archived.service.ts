import { CharacterId, CharacterRepository } from '@world-forge/domain'
import { IdGenerator } from '../../ids/id-generator'
import { ValidationError } from '../../errors/validation.error'
import { NotFoundError } from '../../errors/not-found.error'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { CharacterMapper } from '../../mappers/character.mapper'
import { CreateCharacterFromArchivedResponse } from '../../dtos/character/create-character-from-archived.response'
import { validateCharacterCoreInput } from '../../validators/character-core.validator'

export class CreateCharacterFromArchivedService {
    constructor(
        private readonly repository: CharacterRepository,
        private readonly idGenerator: IdGenerator
    ) {}

    async execute(sourceCharacterId: CharacterId): Promise<CreateCharacterFromArchivedResponse> {
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

        const name = sourceResult.data.name
        const identity = sourceResult.data.identity
        const categories = sourceResult.data.categories
        const inspirations = sourceResult.data.inspirations
        const notes = sourceResult.data.notes
        const image = sourceResult.data.image

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
            status: 'DRAFT',
        })

        if (!createResult.ok) {
            throw mapRepoErrorToAppError(createResult.error)
        }

        return {
            character: CharacterMapper.toDTO(createResult.data),
        }
    }
}
