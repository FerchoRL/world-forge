import { Universe } from '../models'
import { UniverseId } from '../types'
import { RepoResult } from './repo-errors'

export type UniverseUpdatePatch = Partial<Pick<Universe, 'name' | 'premise' | 'rules' | 'notes'>>

export interface UniverseRepository {
    getById(id: UniverseId): Promise<RepoResult<Universe | null>>
    list(): Promise<RepoResult<Universe[]>>

    create(input: Universe): Promise<RepoResult<Universe>>
    update(id: UniverseId, patch: UniverseUpdatePatch): Promise<RepoResult<Universe>>

    archive(id: UniverseId): Promise<RepoResult<void>>
}