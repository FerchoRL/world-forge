import { CharacterRepository, CharacterId } from '@world-forge/domain'
import { CATEGORIES } from '@world-forge/domain'
import { UpdateCharacterRequest } from '../../dtos/character/update-character.request'
import { UpdateCharacterResponse } from '../../dtos/character/update-character.response'
import { CharacterMapper } from '../../mappers/character.mapper'
import { ValidationError } from '../../errors/validation.error'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import {
    validateCategories,
    validateIdentity,
    validateImage,
    validateInspirations,
    validateName,
    validateNotes,
} from '../../validators/character-core.validator'

export class UpdateCharacterService {

    constructor(
        private readonly repository: CharacterRepository
    ) {}

    async execute(
        id: CharacterId,
        patch: UpdateCharacterRequest
    ): Promise<UpdateCharacterResponse> {
        if (typeof id !== 'string' || id.trim() === '') {
            throw new ValidationError('Character id is required')
        }

        if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
            throw new ValidationError('Patch must be a valid object')
        }

        const allowedFields = [
            'name',
            'categories',
            'identity',
            'inspirations',
            'notes',
            'image',
        ] as const

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
            validateName(patch.name)
        }

        if ('identity' in patch) {
            validateIdentity(patch.identity)
        }

        if ('categories' in patch) {
            validateCategories(patch.categories)
        }

        if ('inspirations' in patch) {
            validateInspirations(patch.inspirations)
        }

        if ('notes' in patch && patch.notes !== undefined) {
            validateNotes(patch.notes)
        }

        if ('image' in patch && patch.image !== undefined) {
            validateImage(patch.image)
        }

        const result = await this.repository.updateCore(id, patch)

        if (!result.ok) {
            throw mapRepoErrorToAppError(result.error)
        }

        return {
            character: CharacterMapper.toDTO(result.data),
        }
    }
}
