import { Universe } from '../models'
import { Status, UniverseId } from '../types'
import { RepoResult } from './repo-errors'

export interface CreateUniverseInput {
    id: UniverseId
    name: string
    premise: string
    rules?: string[]
    notes?: string
    status: 'DRAFT' | 'ACTIVE'
}

export interface UpdateUniverseCoreInput {
    name?: string
    premise?: string
    rules?: string[]
    notes?: string
}

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

    create(input: CreateUniverseInput): Promise<RepoResult<Universe>>
    updateCore(id: UniverseId, patch: UpdateUniverseCoreInput): Promise<RepoResult<Universe>>
    changeStatus(id: UniverseId, status: 'ACTIVE' | 'ARCHIVED'): Promise<RepoResult<Universe>>
}