import { canTransitionCharacterStatus, CharacterId, CharacterRepository } from '@world-forge/domain'
import { ValidationError } from '../../errors/validation.error'
import { NotFoundError } from '../../errors/not-found.error'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { CharacterMapper } from '../../mappers/character.mapper'
import { ChangeCharacterStatusResponse } from '../../dtos/character/change-character-status.response'

export class ChangeCharacterStatusService {
    constructor(
        private readonly repository: CharacterRepository
    ) {}

    async execute(
        id: CharacterId,
        status: 'ACTIVE' | 'ARCHIVED'
    ): Promise<ChangeCharacterStatusResponse> {
        if (typeof id !== 'string' || id.trim() === '') {
            throw new ValidationError('Character id is required')
        }

        if (status !== 'ACTIVE' && status !== 'ARCHIVED') {
            throw new ValidationError('Status must be ACTIVE or ARCHIVED')
        }

        const currentResult = await this.repository.getById(id)

        if (!currentResult.ok) {
            throw mapRepoErrorToAppError(currentResult.error)
        }

        if (!currentResult.data) {
            throw new NotFoundError(`Character ${id} not found`)
        }

        if (!canTransitionCharacterStatus(currentResult.data.status, status)) {
            throw new ValidationError(
                `Status transition ${currentResult.data.status} -> ${status} is not allowed`
            )
        }

        const result = await this.repository.changeStatus(id, status)

        if (!result.ok) {
            throw mapRepoErrorToAppError(result.error)
        }

        return {
            character: CharacterMapper.toDTO(result.data),
        }
    }
}
