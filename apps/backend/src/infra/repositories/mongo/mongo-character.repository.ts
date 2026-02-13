import { Character, CharacterRepository } from '@world-forge/domain'
import { RepoResult } from '@world-forge/domain'
import { CharacterId } from '@world-forge/domain'


import { CharacterModel } from '../../schemas/character.schema'
import { CharacterMongoMapper } from '../../mappers/character.mongo-mapper'
import e from 'express'

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

    async list(
        page: number,
        limit: number
    ): Promise<RepoResult<{ items: Character[]; total: number }>> {
        try {
            const skip = (page - 1) * limit

            const [docs, total] = await Promise.all([
                CharacterModel.find()
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                CharacterModel.countDocuments(),
            ])

            return {
                ok: true,
                data: {
                    items: docs.map(CharacterMongoMapper.toDomain),
                    total,
                },
            }
        } catch (error) {
            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: 'Error listing paginated characters from database',
                },
            }
        }
    }


    async create(input: Character): Promise<RepoResult<Character>> {
        try {
            // Mapea a formato de persistencia
            const doc = CharacterMongoMapper.toPersistence(input)
            await CharacterModel.create(doc)
            return { ok: true, data: input }
        } catch (error: unknown) {
            //Clasificacion de errores de DB para RepoResult (Sin HTTP aqui)
            const err = error as any
            //Mongo duplicate key error
            if (err.code === 11000) {
                return {
                    ok: false,
                    error: {
                        code: 'CONFLICT',
                        message: 'Character with this ID already exists',
                        meta: { mongoCode: err.code, keyValue: err.keyValue }
                    }
                }
            }

            // Mongoose validation error (enum/required/minlength/etc)
            if (err.name === 'ValidationError') {
                return {
                    ok: false,
                    error: {
                        code: 'VALIDATION',
                        message: err.message ?? 'Validation error',
                        meta: { name: err.name, errors: err.errors }
                    }
                }
            }
            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: err?.message ?? 'Error creating character in database',
                    meta: { name: err?.name, stack: err?.stack },
                }
            }
        }
    }

    async update(
        id: CharacterId,
        patch: Partial<Character>
    ): Promise<RepoResult<Character>> {
        try {
            const updateDoc = {
                ...patch,
            }

            await CharacterModel.updateOne(
                { _id: id },
                { $set: updateDoc }
            )

            const updatedDoc = await CharacterModel.findById(id).lean()

            if (!updatedDoc) {
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
        } catch (error) {
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
        try {
            await CharacterModel.updateOne(
                { _id: id },
                { $set: { status: 'ARCHIVED' } }
            )

            return { ok: true, data: undefined }
        } catch (error) {
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