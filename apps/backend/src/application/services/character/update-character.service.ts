import { CharacterRepository, CharacterId } from '@world-forge/domain'
import { UpdateCharacterRequest } from '../../dtos/character/update-character.request'
import { UpdateCharacterResponse } from '../../dtos/character/update-character.response'
import { CharacterMapper } from '../../mappers/character.mapper'
import { ValidationError } from '../../errors/validation.error'

export class UpdateCharacterService {

    constructor(
        private readonly repository: CharacterRepository
    ) {}

    async execute(
        id: CharacterId,
        patch: UpdateCharacterRequest
    ): Promise<UpdateCharacterResponse> {

        if (!id) {
            throw new ValidationError('Character id is required')
        }

        const result = await this.repository.update(id, patch as any)

        if (!result.ok) {
            throw result.error
        }

        return {
            character: CharacterMapper.toDTO(result.data),
        }
    }
}
