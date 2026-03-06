import { Universe } from '../models'
import { Status, UniverseId } from '../types'
import { RepoResult } from './repo-errors'

export type UniverseUpdatePatch = Partial<Pick<Universe, 'name' | 'premise' | 'rules' | 'notes'>>

export interface ListUniversesParams {
    page: number
    limit: number
    search?: string
    status?: Status
}

export interface PaginatedUniverseResult {
    items: Universe[]
    total: number
}

export interface UniverseRepository {
    getById(id: UniverseId): Promise<RepoResult<Universe | null>>
    list(params: ListUniversesParams): Promise<RepoResult<PaginatedUniverseResult>>

    create(input: Universe): Promise<RepoResult<Universe>>
    update(id: UniverseId, patch: UniverseUpdatePatch): Promise<RepoResult<Universe>>

    archive(id: UniverseId): Promise<RepoResult<void>>
}