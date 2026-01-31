import { CharacterRepository } from '@world-forge/domain'
import { CharacterMapper } from '../../mappers/character.mapper'
import { ListCharactersResponse } from '../../dtos/character/list-characters.response'

export class ListCharactersService {

    constructor(
        private readonly repository: CharacterRepository
    ) {}

    async execute(): Promise<ListCharactersResponse> {
        const result = await this.repository.list()

        if (!result.ok) {
            throw result.error
        }

        return {
            characters: result.data.map(CharacterMapper.toDTO),
        }
    }
}
