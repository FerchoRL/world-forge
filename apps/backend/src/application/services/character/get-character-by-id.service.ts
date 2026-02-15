import { CharacterRepository, CharacterId } from "@world-forge/domain";
import { CharacterMapper } from "../../mappers/character.mapper";
import { ValidationError } from "../../errors/validation.error";
import { GetCharacterByIdResponse } from "../../dtos/character/get-character-by-id.response";
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { NotFoundError } from '../../errors/not-found.error'

export class GetCharacterByIdService {
    constructor(private readonly repository: CharacterRepository) { }

    async execute(id: CharacterId): Promise<GetCharacterByIdResponse> {
        if (typeof id !== 'string' || id.trim() === '') {
            throw new ValidationError('Character id is required')
        }

        const result = await this.repository.getById(id)

        if (!result.ok) {
            throw mapRepoErrorToAppError(result.error)
        }

        if (!result.data) {
            throw new NotFoundError(`Character ${id} not found`)
        }

        return { character: CharacterMapper.toDTO(result.data) }
    }
}
