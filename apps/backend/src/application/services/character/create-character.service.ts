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
        if (typeof input.name !== 'string' || input.name.trim() === '') {
            throw new ValidationError('Character Name is required')
        }
        if (typeof input.identity !== 'string' || input.identity.trim() === '') {
            throw new ValidationError('Character Identity is required')
        }
        // Validación de categories
        if (!Array.isArray(input.categories)) {
            throw new ValidationError('Categories must be an array')
        }

        if (input.categories.length === 0) {
            throw new ValidationError('At least one Category is required')
        }

        // Validar duplicados
        const uniqueCategories = new Set(input.categories)

        if (uniqueCategories.size !== input.categories.length) {
            throw new ValidationError('Categories must not contain duplicates')
        }

        for (const category of input.categories) {
            if (typeof category !== 'string' || !CATEGORIES[category]) {
                throw new ValidationError(`Category ${category} is not valid`)
            }
        }
        // Validación de inspirations
        if (!Array.isArray(input.inspirations)) {
            throw new ValidationError('Inspirations must be an array')
        }

        if (input.inspirations.length === 0) {
            throw new ValidationError('At least one Inspiration is required')
        }

        for (const inspiration of input.inspirations) {
            if (typeof inspiration !== 'string' || inspiration.trim() === '') {
                throw new ValidationError('Each Inspiration must be a non-empty string')
            }
        }

        // Validación de notes (opcional)
        if (input.notes !== undefined) {
            if (typeof input.notes !== 'string') {
                throw new ValidationError('Notes must be a string')
            }

            if (input.notes.trim() === '') {
                throw new ValidationError('Notes cannot be empty')
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