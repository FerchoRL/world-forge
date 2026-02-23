import { canTransitionCharacterStatus, CharacterRepository, CharacterId } from '@world-forge/domain'
import { ArchiveCharacterResponse } from '../../dtos/character/archive-character.response'
import { ValidationError } from '../../errors/validation.error'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { NotFoundError } from '../../errors/not-found.error'

export class ArchiveCharacterService {

    constructor(
        private readonly repository: CharacterRepository
    ) {}

    async execute(id: CharacterId): Promise<ArchiveCharacterResponse> {
        if (!id) {
            throw new ValidationError('Character id is required')
        }

        const getResult = await this.repository.getById(id)

        if (!getResult.ok) {
            throw mapRepoErrorToAppError(getResult.error)
        }

        if (!getResult.data) {
            throw new NotFoundError(`Character ${id} not found`)
        }

        if (!canTransitionCharacterStatus(getResult.data.status, 'ARCHIVED')) {
            throw new ValidationError(
                `Status transition ${getResult.data.status} -> ARCHIVED is not allowed`
            )
        }

        const result = await this.repository.changeStatus(id, 'ARCHIVED')

        if (!result.ok) {
            throw mapRepoErrorToAppError(result.error)
        }

        return { ok: true }
    }
}
