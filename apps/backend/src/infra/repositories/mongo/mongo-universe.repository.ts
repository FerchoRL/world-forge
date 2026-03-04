import {
    RepoResult,
    Universe,
    UniverseId,
    UniverseRepository,
    UniverseUpdatePatch,
} from '@world-forge/domain'

import { UniverseMongoMapper } from '../../mappers/universe.mongo-mapper'
import { UniverseModel } from '../../schemas/universe.schema'

// Implementación Mongo del repositorio de Universe
export class MongoUniverseRepository implements UniverseRepository {
    async getById(_id: UniverseId): Promise<RepoResult<Universe | null>> {
        return {
            ok: false,
            error: {
                code: 'UNKNOWN',
                message: 'Not implemented yet: getById',
            },
        }
    }

    async list(): Promise<RepoResult<Universe[]>> {
        return {
            ok: false,
            error: {
                code: 'UNKNOWN',
                message: 'Not implemented yet: list',
            },
        }
    }

    async create(input: Universe): Promise<RepoResult<Universe>> {
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

    async update(_id: UniverseId, _patch: UniverseUpdatePatch): Promise<RepoResult<Universe>> {
        return {
            ok: false,
            error: {
                code: 'UNKNOWN',
                message: 'Not implemented yet: update',
            },
        }
    }

    async archive(_id: UniverseId): Promise<RepoResult<void>> {
        return {
            ok: false,
            error: {
                code: 'UNKNOWN',
                message: 'Not implemented yet: archive',
            },
        }
    }
}
