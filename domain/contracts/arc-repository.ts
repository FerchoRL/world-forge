import { Arc } from '../models'
import { ArcId, CharacterId, StoryId } from '../types'
import { RepoResult } from './repo-errors'

export interface ArcRepository {
    getById(id: ArcId): Promise<RepoResult<Arc | null>>
    listByStory(storyId: StoryId): Promise<RepoResult<Arc[]>>

    //Obtener el arco asociado a un personaje en una historia específica
    getByStoryAndCharacter(storyId: StoryId, characterId: CharacterId): Promise<RepoResult<Arc | null>>

    create(input: Arc): Promise<RepoResult<Arc>>
    update(id: ArcId, patch: Partial<Arc>): Promise<RepoResult<Arc>>

    archive(id: ArcId): Promise<RepoResult<void>>
}