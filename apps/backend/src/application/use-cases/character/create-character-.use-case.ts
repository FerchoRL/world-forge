import { CharacterRepository } from '@world-forge/domain'

import { CharacterMapper } from '../../mappers/character.mapper'
import { CreateCharacterRequest } from '../../dtos/character/create-character.request'
import { CharacterDTO } from '../../dtos/character/character.dto'
import { IdGenerator } from '../../ids/id-generator'
import { ValidationError } from '../../errors/validation.error'

export class CreateCharacterUseCase {
    constructor(
        private readonly repository: CharacterRepository,
        private readonly idGenerator: IdGenerator
    ){}

    async execute(input: CreateCharacterRequest): Promise<CharacterDTO> {
        // Validaicones minimas
        if(!input.name || input.name.trim() === ''){
            throw new ValidationError('Character Name is required')
        }
        if(!input.identity?.trim()){
            throw new ValidationError('Character Identity is required')
        }
        if(!input.categories || input.categories.length === 0){
            throw new ValidationError('At least one Category is required')
        }
        if(!input.inspirations || input.inspirations.length === 0){
            throw new ValidationError('At least one Inspiration is required')
        }

        // Genera ID
        const newId = this.idGenerator.generate()

        // Mapea a dominio
        const newCharacter = CharacterMapper.toDomain(newId, {
            ...input,
            status: input.status ?? 'DRAFT',
        })

        // Persiste
        const result = await this.repository.create(newCharacter)

        if(!result.ok){
            throw result.error
        }

        // Mapea a DTO y retorna
        return CharacterMapper.toDTO(result.data)
    }
}