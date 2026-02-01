import { Character, Status, CategoryName } from '@world-forge/domain'

type CharacterDocument = {
    _id: string
    name: string
    status: Status
    categories: string[] //mongo no tiene enums
    identity: string
    inspirations: string[]
    notes?: string | null
}

/**
 * Mapper Exclusivo de infraestructura
 * Traduce entre el modelo de dominio y el modelo de persistencia (MongoDB)
 */

export class CharacterMongoMapper {
    static toPersistence(character: Character): CharacterDocument {
        return {
            _id: character.id,
            name: character.name,
            status: character.status,
            categories: character.categories, //CategoryName[] -> string[]
            identity: character.identity,
            inspirations: character.inspirations,
            notes: character.notes,
        }
    }

    static toDomain(doc: CharacterDocument): Character {
        return {
            id: doc._id,
            name: doc.name,
            status: doc.status,
            categories: doc.categories as Character['categories'], //string[] -> CategoryName[]
            identity: doc.identity,
            inspirations: doc.inspirations,
            notes: doc.notes ?? undefined,
        }
    }
}