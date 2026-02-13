import { CharacterRepository } from '@world-forge/domain'
import { CATEGORIES } from '@world-forge/domain'

import { CharacterMapper } from '../../mappers/character.mapper'
import { CreateCharacterRequest } from '../../dtos/character/create-character.request'
import { CharacterDTO } from '../../dtos/character/character.dto'
import { IdGenerator } from '../../ids/id-generator'
import { ValidationError } from '../../errors/validation.error'
import { mapRepoErrorToAppError } from '../../errors/map-repo-error'
import { isValidStatus } from '../../validators/status.validator'


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

    async execute(input: CreateCharacterRequest): Promise<CharacterDTO> {
        // Validaicones minimas
        if (!input.name || input.name.trim() === '') {
            throw new ValidationError('Character Name is required')
        }
        if (!input.identity?.trim()) {
            throw new ValidationError('Character Identity is required')
        }
        if (!input.categories || input.categories.length === 0) {
            throw new ValidationError('At least one Category is required')
        }
        if (!input.inspirations || input.inspirations.length === 0) {
            throw new ValidationError('At least one Inspiration is required')
        }

        // Valida que las categorias existan
        for (const category of input.categories) {
            if (!CATEGORIES[category]) {
                throw new ValidationError(`Category ${category} is not valid`)
            }
        }

        //Validacion de status
        const status = input.status ?? 'DRAFT'
        if (!isValidStatus(status)) {
            throw new ValidationError(
                `Status ${status} is not valid. Allowed values: DRAFT | ACTIVE | ARCHIVED`
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
        const result = await this.repository.create(newCharacter)

        if (!result.ok) {
            // Traduce el error del repositorio a error de aplicación
            throw mapRepoErrorToAppError(result.error)
        }

        // Mapea a DTO y retorna
        return CharacterMapper.toDTO(result.data)
    }
}