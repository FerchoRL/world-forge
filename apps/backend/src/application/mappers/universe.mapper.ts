import { Universe, UniverseId, UpdateUniverseCoreInput } from '@world-forge/domain'

import { CreateUniverseRequest } from '../dtos/universe/create-universe.request'
import { UpdateUniverseRequest } from '../dtos/universe/update-universe.request'
import { UniverseDTO } from '../dtos/universe/universe.dto'

/**
 * Traduce entre DTOs y el modelo del dominio Universe
 * No genera IDs
 * No contiene logica
 */

export class UniverseMapper {
    static toDomain(
        id: UniverseId,
        input: CreateUniverseRequest & { status: 'DRAFT' | 'ACTIVE' }
    ): Universe {
        return {
            id,
            name: input.name,
            status: input.status,
            premise: input.premise,
            rules: input.rules,
            notes: input.notes,
        }
    }

    static toUpdatePatch(input: UpdateUniverseRequest): UpdateUniverseCoreInput {
        return {
            name: input.name,
            premise: input.premise,
            rules: input.rules,
            notes: input.notes,
        }
    }

    static toDTO(universe: Universe): UniverseDTO {
        return {
            id: universe.id,
            name: universe.name,
            status: universe.status,
            premise: universe.premise,
            rules: universe.rules,
            notes: universe.notes,
        }
    }
}
