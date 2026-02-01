import { Character, CharacterRepository } from '@world-forge/domain'
import { RepoResult } from '@world-forge/domain'
import { CharacterId } from '@world-forge/domain'


import { CharacterModel } from '../../schemas/character.schema'
import { CharacterMongoMapper } from '../../mappers/character.mongo-mapper'

/**
 * Implementacion Mongo del repositorio de Character
 * Infraestructura sin lógica de negocio
 */

export class MongoCharacterRepository implements CharacterRepository {

    async getById(id: CharacterId): Promise<RepoResult<Character | null>> {
        try {
            const doc = await CharacterModel.findById(id).lean()
            if (!doc) {
                return { ok: true, data: null }
            }

            return {
                ok: true,
                data: CharacterMongoMapper.toDomain(doc)
            }
        } catch (error) {
            return {
                ok: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Error fetching character from database'
                }
            }
        }
    }

    async list(): Promise<RepoResult<Character[]>> {
        try{
            const docs = await CharacterModel.find().lean()
            return{
                ok: true,
                data: docs.map(CharacterMongoMapper.toDomain)
            }
        } catch{
            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: 'Error listing characters from database'
                }
            }
        }
    }

    async create(input: Character): Promise<RepoResult<Character>> {
        try{
            const doc = CharacterMongoMapper.toPersistence(input)
            await CharacterModel.create(doc)
            return { ok: true, data: input }
        } catch(error){
            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: 'Error creating character in database'
                }
            }
        }
    }

    async update(
        id: CharacterId,
        patch: Partial<Character>
    ): Promise<RepoResult<Character>> {
        try{
            const updateDoc = {
                ...patch,
            }

            await CharacterModel.updateOne(
                { _id: id },
                { $set: updateDoc }
            )

            const updatedDoc = await CharacterModel.findById(id).lean()

            if(!updatedDoc){
                return {
                    ok: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Character not found after update'
                    }
                }
            }

            return {
                ok: true,
                data: CharacterMongoMapper.toDomain(updatedDoc)
            }
        }catch(error){
            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: 'Error updating character in database'
                }
            }
        }
    }

    async archive(id: CharacterId): Promise<RepoResult<void>> {
        try{
            await CharacterModel.updateOne(
                { _id: id },
                { $set: { status: 'ARCHIVED' } }
            )

            return { ok: true, data: undefined }
        } catch(error){
            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: 'Error archiving character in database'
                }
            }
        }
    }
}