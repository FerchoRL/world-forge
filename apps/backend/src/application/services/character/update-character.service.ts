import { CharacterRepository, CharacterId } from '@world-forge/domain'
import { CATEGORIES } from '@world-forge/domain'
import { UpdateCharacterRequest } from '../../dtos/character/update-character.request'
import { UpdateCharacterResponse } from '../../dtos/character/update-character.response'
import { CharacterMapper } from '../../mappers/character.mapper'
import { ValidationError } from '../../errors/validation.error'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'

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
            if (typeof patch.name !== 'string' || patch.name.trim() === '') {
                throw new ValidationError('Character Name is required')
            }
        }

        if ('identity' in patch) {
            if (typeof patch.identity !== 'string' || patch.identity.trim() === '') {
                throw new ValidationError('Character Identity is required')
            }
        }

        if ('categories' in patch) {
            if (!Array.isArray(patch.categories)) {
                throw new ValidationError('Categories must be an array')
            }

            if (patch.categories.length === 0) {
                throw new ValidationError('At least one Category is required')
            }

            const uniqueCategories = new Set(patch.categories)

            if (uniqueCategories.size !== patch.categories.length) {
                throw new ValidationError('Categories must not contain duplicates')
            }

            for (const category of patch.categories) {
                if (typeof category !== 'string' || !CATEGORIES[category]) {
                    throw new ValidationError(`Category ${category} is not valid`)
                }
            }
        }

        if ('inspirations' in patch) {
            if (!Array.isArray(patch.inspirations)) {
                throw new ValidationError('Inspirations must be an array')
            }

            if (patch.inspirations.length === 0) {
                throw new ValidationError('At least one Inspiration is required')
            }

            for (const inspiration of patch.inspirations) {
                if (typeof inspiration !== 'string' || inspiration.trim() === '') {
                    throw new ValidationError('Each Inspiration must be a non-empty string')
                }
            }
        }

        if ('notes' in patch && patch.notes !== undefined) {
            if (typeof patch.notes !== 'string') {
                throw new ValidationError('Notes must be a string')
            }

            if (patch.notes.trim() === '') {
                throw new ValidationError('Notes cannot be empty')
            }
        }

        const result = await this.repository.update(id, patch as any)

        if (!result.ok) {
            throw mapRepoErrorToAppError(result.error)
        }

        return {
            character: CharacterMapper.toDTO(result.data),
        }
    }
}
