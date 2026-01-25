import { Character, CharacterId } from '@world-forge/domain'

import { CreateCharacterRequest } from '../dtos/character/create-character.request'
import { CharacterDTO } from '../dtos/character/character.dto'


/**
 * Traduce entre DTOs y el modelo del dominio Character
 * No genera IDs
 * No contiene logica
 */

export class CharacterMapper {
    static toDomain(
        id: CharacterId,
        input: CreateCharacterRequest
    ): Character {
        return{
            id,
            name: input.name,
            status: input.status,
            categories: input.categories,
            identity: input.identity,
            inspirations: input.inspirations,
            notes: input.notes
        }
    }

    static toDTO(character: Character): CharacterDTO {
        return {
            id: character.id,
            name: character.name,
            status: character.status,
            categories: character.categories,
            identity: character.identity,
            inspirations: character.inspirations,
            notes: character.notes
        }
    }
}