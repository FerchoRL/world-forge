import { Character } from '../models'
import { CharacterId } from '../types'
import { RepoResult } from './repo-errors'

//Repository responde : como leo y guardo entidades del dominio (guardar, leer, actualizar, archivar)
export interface CharacterRepository {
    getById(id: CharacterId): Promise<RepoResult<Character | null>>
    list(): Promise<RepoResult<Character[]>>

    create(input: Character): Promise<RepoResult<Character>>
    update(id: CharacterId, patch: Partial<Character>): Promise<RepoResult<Character>>

    archive(id: CharacterId): Promise<RepoResult<void>>
}
