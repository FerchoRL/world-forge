import { Status, Universe } from '@world-forge/domain'

type UniverseDocument = {
    _id: string
    name: string
    status: Status
    premise: string
    rules?: string[] | null
    notes?: string | null
}

// Mapper de infraestructura para Universe (dominio <-> persistencia)
export class UniverseMongoMapper {
    static toPersistence(universe: Universe): UniverseDocument {
        return {
            _id: universe.id,
            name: universe.name,
            status: universe.status,
            premise: universe.premise,
            rules: universe.rules,
            notes: universe.notes,
        }
    }

    static toDomain(doc: UniverseDocument): Universe {
        return {
            id: doc._id,
            name: doc.name,
            status: doc.status,
            premise: doc.premise,
            rules: doc.rules ?? undefined,
            notes: doc.notes ?? undefined,
        }
    }
}
