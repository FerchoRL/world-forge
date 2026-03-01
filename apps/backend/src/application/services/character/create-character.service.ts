import { CharacterRepository } from '@world-forge/domain'

import { CharacterMapper } from '../../mappers/character.mapper'
import { CreateCharacterRequest } from '../../dtos/character/create-character.request'
import { CreateCharacterResponse } from '../../dtos/character/create-character.response'
import { IdGenerator } from '../../ids/id-generator'
import { ValidationError } from '../../errors/validation.error'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { validateCharacterCoreInput } from '../../validators/character-core.validator'


export class CreateCharacterService {

    /**
     * Aunque el tipo es CharacterRepository (interfaz del dominio),
     * en runtime se inyecta la implementación concreta (ej: MongoCharacterRepository).
     * TypeScript navega al contrato, pero la ejecución usa la clase real.
     */

    constructor(
        private readonly repository: CharacterRepository,
        private readonly idGenerator: IdGenerator
    ) { }

    async execute(input: CreateCharacterRequest): Promise<CreateCharacterResponse> {
        validateCharacterCoreInput({
            name: input.name,
            identity: input.identity,
            categories: input.categories,
            inspirations: input.inspirations,
            notes: input.notes,
            image: input.image,
        })


        //Validacion de status
        const status = input.status ?? 'DRAFT'
        if (status !== 'DRAFT' && status !== 'ACTIVE') {
            throw new ValidationError(
                `Status ${status} is not valid. Allowed values: DRAFT | ACTIVE`
            )
        }


        // Genera ID
        const newId = this.idGenerator.generate()

        // Mapea a dominio
        const newCharacter = CharacterMapper.toDomain(newId, {
            ...input,
            status
        })

        // Persiste
        const result = await this.repository.create({
            id: newCharacter.id,
            name: newCharacter.name,
            status,
            categories: newCharacter.categories,
            identity: newCharacter.identity,
            inspirations: newCharacter.inspirations,
            notes: newCharacter.notes,
            image: newCharacter.image,
        })

        if (!result.ok) {
            // Traduce el error del repositorio a error de aplicación
            throw mapRepoErrorToAppError(result.error)
        }

        // Mapea a DTO y retorna
        return {
            character: CharacterMapper.toDTO(result.data),
        }
    }
}