import { Story } from '../models'
import { StoryId, UniverseId} from '../types'
import { RepoResult } from './repo-errors'

export interface StoryRepository {
    getById(id: StoryId): Promise<RepoResult<Story | null>>
    list(): Promise<RepoResult<Story[]>>
    listByUniverse(universeId: UniverseId): Promise<RepoResult<Story[]>>

    create(input: Story): Promise<RepoResult<Story>>
    update(id: StoryId, patch: Partial<Story>): Promise<RepoResult<Story>>

    archive(id: StoryId): Promise<RepoResult<void>>
    
}