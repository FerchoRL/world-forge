import {
    CreateUniverseInput,
    ListUniversesParams,
    PaginatedUniverseResult,
    RepoResult,
    Universe,
    UniverseId,
    UniverseRepository,
    UpdateUniverseCoreInput,
} from '@world-forge/domain'

import { UniverseMongoMapper } from '../../mappers/universe.mongo-mapper'
import { UniverseModel } from '../../schemas/universe.schema'

// Implementación Mongo del repositorio de Universe
export class MongoUniverseRepository implements UniverseRepository {
    async getById(id: UniverseId): Promise<RepoResult<Universe | null>> {
        try {
            const doc = await UniverseModel.findById(id).lean()

            if (!doc) {
                return { ok: true, data: null }
            }

            return {
                ok: true,
                data: UniverseMongoMapper.toDomain(doc),
            }
        } catch (error: unknown) {
            const err = error as any

            if (err?.name === 'ValidationError') {
                return {
                    ok: false,
                    error: {
                        code: 'VALIDATION',
                        message: err.message ?? 'Validation error while fetching universe by id',
                        meta: { name: err.name, errors: err.errors },
                    },
                }
            }

            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: err?.message ?? 'Error fetching universe from database',
                    meta: { name: err?.name, stack: err?.stack },
                },
            }
        }
    }

    async list(params: ListUniversesParams): Promise<RepoResult<PaginatedUniverseResult>> {
        try {
            const { page, limit, search, status } = params
            const skip = (page - 1) * limit

            const filter: Record<string, unknown> = {}

            if (status) {
                filter.status = status
            }

            if (search) {
                const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                const regex = new RegExp(escaped, 'i')

                filter.$or = [
                    { name: regex },
                    { premise: regex },
                    { notes: regex },
                    { rules: regex },
                ]
            }

            const [docs, total] = await Promise.all([
                UniverseModel.find(filter)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                UniverseModel.countDocuments(filter),
            ])

            return {
                ok: true,
                data: {
                    items: docs.map(UniverseMongoMapper.toDomain),
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
                        message: err.message ?? 'Validation error while listing universes',
                        meta: { name: err.name, errors: err.errors },
                    },
                }
            }

            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: err?.message ?? 'Error listing universes from database',
                    meta: { name: err?.name, stack: err?.stack },
                },
            }
        }
    }

    async create(input: CreateUniverseInput): Promise<RepoResult<Universe>> {
        try {
            const doc = UniverseMongoMapper.toPersistence(input)
            await UniverseModel.create(doc)

            return {
                ok: true,
                data: input,
            }
        } catch (error: unknown) {
            const err = error as any

            if (err?.code === 11000) {
                return {
                    ok: false,
                    error: {
                        code: 'CONFLICT',
                        message: 'Universe name already exists for an ACTIVE or DRAFT universe',
                        meta: { mongoCode: err.code, keyValue: err.keyValue },
                    },
                }
            }

            if (err?.name === 'ValidationError') {
                return {
                    ok: false,
                    error: {
                        code: 'VALIDATION',
                        message: err.message ?? 'Validation error while creating universe',
                        meta: { name: err.name, errors: err.errors },
                    },
                }
            }

            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: err?.message ?? 'Error creating universe in database',
                    meta: { name: err?.name, stack: err?.stack },
                },
            }
        }
    }

    async updateCore(
        id: UniverseId,
        patch: UpdateUniverseCoreInput
    ): Promise<RepoResult<Universe>> {
        try {
            const updateDoc = {
                ...patch,
            }

            const updateResult = await UniverseModel.updateOne(
                { _id: id },
                { $set: updateDoc }
            )

            if (updateResult.matchedCount === 0) {
                return {
                    ok: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Universe not found',
                    },
                }
            }

            const updatedDoc = await UniverseModel.findById(id).lean()

            if (!updatedDoc) {
                return {
                    ok: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Universe not found after update',
                    },
                }
            }

            return {
                ok: true,
                data: UniverseMongoMapper.toDomain(updatedDoc),
            }
        } catch (error: unknown) {
            const err = error as any

            if (err?.code === 11000) {
                return {
                    ok: false,
                    error: {
                        code: 'CONFLICT',
                        message: 'Universe name already exists for an ACTIVE or DRAFT universe',
                        meta: { mongoCode: err.code, keyValue: err.keyValue },
                    },
                }
            }

            if (err?.name === 'ValidationError') {
                return {
                    ok: false,
                    error: {
                        code: 'VALIDATION',
                        message: err.message ?? 'Validation error while updating universe',
                        meta: { name: err.name, errors: err.errors },
                    },
                }
            }

            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: err?.message ?? 'Error updating universe in database',
                    meta: { name: err?.name, stack: err?.stack },
                },
            }
        }
    }

    async changeStatus(
        id: UniverseId,
        status: 'ACTIVE' | 'ARCHIVED'
    ): Promise<RepoResult<Universe>> {
        try {
            const updatedDoc = await UniverseModel.findOneAndUpdate(
                { _id: id },
                { $set: { status } },
                {
                    new: true,
                    runValidators: true,
                    lean: true,
                }
            )

            if (!updatedDoc) {
                return {
                    ok: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Universe not found',
                    },
                }
            }

            return {
                ok: true,
                data: UniverseMongoMapper.toDomain(updatedDoc),
            }
        } catch (error: unknown) {
            const err = error as any

            if (err?.code === 11000) {
                return {
                    ok: false,
                    error: {
                        code: 'CONFLICT',
                        message: 'Universe name already exists for an ACTIVE or DRAFT universe',
                        meta: { mongoCode: err.code, keyValue: err.keyValue },
                    },
                }
            }

            if (err?.name === 'ValidationError') {
                return {
                    ok: false,
                    error: {
                        code: 'VALIDATION',
                        message: err.message ?? 'Validation error while changing universe status',
                        meta: { name: err.name, errors: err.errors },
                    },
                }
            }

            return {
                ok: false,
                error: {
                    code: 'UNKNOWN',
                    message: err?.message ?? 'Error changing universe status in database',
                    meta: { name: err?.name, stack: err?.stack },
                },
            }
        }
    }
}
