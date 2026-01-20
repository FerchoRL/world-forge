import {CharacterVariant} from '../models'
import { CharacterId, CharacterVariantId, StoryId} from '../types'
import { RepoResult } from './repo-errors'

export interface CharacterVariantRepository {
    getById(id: CharacterVariantId): Promise<RepoResult<CharacterVariant | null>>

    listByCharacter(characterId: CharacterId): Promise<RepoResult<CharacterVariant[]>>
    listByStory(storyId: StoryId): Promise<RepoResult<CharacterVariant[]>>
    //Obtener la variante de un personaje en una historia específica
    getByStoryAndCharacter(storyId: StoryId, characterId: CharacterId): Promise<RepoResult<CharacterVariant | null>>

    create(input: CharacterVariant): Promise<RepoResult<CharacterVariant>>
    update(id: CharacterVariantId, patch: Partial<CharacterVariant>): Promise<RepoResult<CharacterVariant>>

    archive(id: CharacterVariantId): Promise<RepoResult<void>>
}