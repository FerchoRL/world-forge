import { CharacterRepository } from '@world-forge/domain'
import { CharacterMapper } from '../../mappers/character.mapper'
import { ListCharactersResponse, ListCharactersQuery } from '../../dtos/character/list-characters.response'

export class ListCharactersService {

    constructor(
        private readonly repository: CharacterRepository
    ) { }

    async execute(query?: ListCharactersQuery): Promise<ListCharactersResponse> {
        const rawPage = query?.page
        const rawLimit = query?.limit

        const page =
            typeof rawPage === 'number' && rawPage > 0 ? rawPage : 1

        const limit =
            typeof rawLimit === 'number' && rawLimit > 0
                ? Math.min(rawLimit, 50)
                : 10

        const result = await this.repository.list(page, limit)

        if (!result.ok) {
            throw result.error
        }

        return {
            characters: result.data.items.map(CharacterMapper.toDTO),
            page,
            limit,
            total: result.data.total
        }
    }
}
