import { Character, CharacterRepository, CreateCharacterInput, UpdateCharacterCoreInput } from '@world-forge/domain'
import { RepoResult } from '@world-forge/domain'
import { CharacterId } from '@world-forge/domain'


import { CharacterModel } from '../../schemas/character.schema'
import { CharacterMongoMapper } from '../../mappers/character.mongo-mapper'

/**
 * Implementacion Mongo del repositorio de Character
 * Infraestructura sin lógica de negocio
 */

export class MongoCharacterRepository implements CharacterRepository {

    // Lee un character por id
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
        } catch (error: unknown) {
            const err = error as any

            if (err?.name === 'ValidationError') {
                return {
                    ok: false,
                    error: {
                        code: 'VALIDATION',
                        message: err.message ?? 'Validation error while fetching character by id',
                        meta: { name: err.name, errors: err.errors },
                    }
                }
            }

            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: err?.message ?? 'Error fetching character from database',
                    meta: { name: err?.name, stack: err?.stack },
                }
            }
        }
    }

    // Lista characters de forma paginada
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
        } catch (error: unknown) {
            const err = error as any

            if (err?.name === 'ValidationError') {
                return {
                    ok: false,
                    error: {
                        code: 'VALIDATION',
                        message: err.message ?? 'Validation error while listing characters',
                        meta: { name: err.name, errors: err.errors },
                    },
                }
            }

            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: err?.message ?? 'Error listing paginated characters from database',
                    meta: { name: err?.name, stack: err?.stack },
                },
            }
        }
    }


    // Crea un character en persistencia
    async create(input: CreateCharacterInput): Promise<RepoResult<Character>> {
        try {
            // Mapea a formato de persistencia
            const doc = CharacterMongoMapper.toPersistence(input)
            await CharacterModel.create(doc)
            return {
                ok: true,
                data: {
                    id: input.id,
                    name: input.name,
                    status: input.status,
                    categories: input.categories,
                    identity: input.identity,
                    inspirations: input.inspirations,
                    notes: input.notes,
                    image: input.image,
                }
            }
        } catch (error: unknown) {
            //Clasificacion de errores de DB para RepoResult (Sin HTTP aqui)
            const err = error as any
            //Mongo duplicate key error
            if (err.code === 11000) {
                return {
                    ok: false,
                    error: {
                        code: 'CONFLICT',
                        message: 'Character name already exists for an ACTIVE or DRAFT character',
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

    // Actualiza campos del núcleo conceptual
    async updateCore(
        id: CharacterId,
        patch: UpdateCharacterCoreInput
    ): Promise<RepoResult<Character>> {
        try {
            const updateDoc = {
                ...patch,
            }

            const updateResult = await CharacterModel.updateOne(
                { _id: id },
                { $set: updateDoc }
            )

            if (updateResult.matchedCount === 0) {
                return {
                    ok: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Character not found'
                    }
                }
            }

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
        } catch (error: unknown) {
            const err = error as any

            if (err?.code === 11000) {
                return {
                    ok: false,
                    error: {
                        code: 'CONFLICT',
                        message: 'Character name already exists for an ACTIVE or DRAFT character',
                        meta: { mongoCode: err.code, keyValue: err.keyValue },
                    }
                }
            }

            if (err?.name === 'ValidationError') {
                return {
                    ok: false,
                    error: {
                        code: 'VALIDATION',
                        message: err.message ?? 'Validation error while updating character',
                        meta: { name: err.name, errors: err.errors },
                    }
                }
            }

            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: err?.message ?? 'Error updating character in database',
                    meta: { name: err?.name, stack: err?.stack },
                }
            }
        }
    }

    // Cambia únicamente el status del character
    async changeStatus(
        id: CharacterId,
        status: 'ACTIVE' | 'ARCHIVED'
    ): Promise<RepoResult<Character>> {
        try {
            const updateResult = await CharacterModel.updateOne(
                { _id: id },
                { $set: { status } }
            )

            if (updateResult.matchedCount === 0) {
                return {
                    ok: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Character not found'
                    }
                }
            }

            const updatedDoc = await CharacterModel.findById(id).lean()

            if (!updatedDoc) {
                return {
                    ok: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Character not found after status change'
                    }
                }
            }

            return {
                ok: true,
                data: CharacterMongoMapper.toDomain(updatedDoc)
            }
        } catch (error: unknown) {
            const err = error as any

            if (err?.code === 11000) {
                return {
                    ok: false,
                    error: {
                        code: 'CONFLICT',
                        message: 'Character name already exists for an ACTIVE or DRAFT character',
                        meta: { mongoCode: err.code, keyValue: err.keyValue },
                    }
                }
            }

            if (err?.name === 'ValidationError') {
                return {
                    ok: false,
                    error: {
                        code: 'VALIDATION',
                        message: err.message ?? 'Validation error while changing character status',
                        meta: { name: err.name, errors: err.errors },
                    }
                }
            }

            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: err?.message ?? 'Error changing character status in database',
                    meta: { name: err?.name, stack: err?.stack },
                }
            }
        }
    }

}