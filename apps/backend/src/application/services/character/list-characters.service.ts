import { CharacterRepository } from '@world-forge/domain'
import { CharacterMapper } from '../../mappers/character.mapper'
import { ListCharactersResponse, ListCharactersQuery } from '../../dtos/character/list-characters.response'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { ValidationError } from '../../errors/validation.error'

export class ListCharactersService {

    constructor(
        private readonly repository: CharacterRepository
    ) { }

    async execute(query?: ListCharactersQuery): Promise<ListCharactersResponse> {
        const rawPage = query?.page
        const rawLimit = query?.limit

        if (
            rawPage !== undefined &&
            (!Number.isInteger(rawPage) || rawPage < 1)
        ) {
            throw new ValidationError('Page must be a positive integer')
        }

        if (
            rawLimit !== undefined &&
            (!Number.isInteger(rawLimit) || rawLimit < 1)
        ) {
            throw new ValidationError('Limit must be a positive integer')
        }

        const page =
            typeof rawPage === 'number' ? rawPage : 1

        const limit =
            typeof rawLimit === 'number'
                ? Math.min(rawLimit, 50)
                : 10

        const result = await this.repository.list(page, limit)

        if (!result.ok) {
            throw mapRepoErrorToAppError(result.error)
        }

        return {
            characters: result.data.items.map(CharacterMapper.toDTO),
            page,
            limit,
            total: result.data.total
        }
    }
}
