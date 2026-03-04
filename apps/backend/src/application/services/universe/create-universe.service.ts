import { UniverseRepository } from '@world-forge/domain'

import { CreateUniverseRequest } from '../../dtos/universe/create-universe.request'
import { CreateUniverseResponse } from '../../dtos/universe/create-universe.response'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { ValidationError } from '../../errors/validation.error'
import { IdGenerator } from '../../ids/id-generator'
import { UniverseMapper } from '../../mappers/universe.mapper'
import { validateUniverseCoreInput } from '../../validators/universe-core.validator'

/**
 * Caso de uso: crear un Universe
 * - valida input
 * - asigna ID
 * - persiste en repositorio
 */

export class CreateUniverseService {
    constructor(
        private readonly repository: UniverseRepository,
        private readonly idGenerator: IdGenerator
    ) { }

    async execute(input: CreateUniverseRequest): Promise<CreateUniverseResponse> {
        // Valida estructura base del universo
        validateUniverseCoreInput({
            name: input.name,
            premise: input.premise,
            rules: input.rules,
            notes: input.notes,
        })

        // Status permitido para creación
        const status = input.status ?? 'DRAFT'
        if (status !== 'DRAFT' && status !== 'ACTIVE') {
            throw new ValidationError(
                `Status ${status} is not valid. Allowed values: DRAFT | ACTIVE`
            )
        }

        // Crea entidad de dominio y persiste
        const newId = this.idGenerator.generateUniverseId()
        const newUniverse = UniverseMapper.toDomain(newId, {
            ...input,
            status,
        })

        const result = await this.repository.create(newUniverse)

        if (!result.ok) {
            throw mapRepoErrorToAppError(result.error)
        }

        return {
            universe: UniverseMapper.toDTO(result.data),
        }
    }
}
