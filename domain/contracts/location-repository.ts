import { Location } from '../models'
import { LocationId } from '../types'
import { RepoResult } from './repo-errors'

export interface LocationRepository {
    getById(id: LocationId): Promise<RepoResult<Location | null>>
    list(): Promise<RepoResult<Location[]>>

    create(input: Location): Promise<RepoResult<Location>>
    update(id: LocationId, patch: Partial<Location>): Promise<RepoResult<Location>>

    archive(id: LocationId): Promise<RepoResult<void>>
}