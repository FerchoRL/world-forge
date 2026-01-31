import { CharacterRepository, CharacterId } from '@world-forge/domain'
import { ArchiveCharacterResponse } from '../../dtos/character/archive-character.response'
import { ValidationError } from '../../errors/validation.error'

export class ArchiveCharacterService {

    constructor(
        private readonly repository: CharacterRepository
    ) {}

    async execute(id: CharacterId): Promise<ArchiveCharacterResponse> {
        if (!id) {
            throw new ValidationError('Character id is required')
        }

        const result = await this.repository.archive(id)

        if (!result.ok) {
            throw result.error
        }

        return { ok: true }
    }
}
