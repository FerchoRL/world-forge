import { Character } from '../models'
import { CharacterId } from '../types'
import { RepoResult } from './repo-errors'

//Resultado paginado generico
export interface PaginatedResult<T> {
    items: T[]
    total: number
}

//Repository responde : como leo y guardo entidades del dominio (guardar, leer, actualizar, archivar)
export interface CharacterRepository {
    getById(id: CharacterId): Promise<RepoResult<Character | null>>
    list(
        page: number, 
        limit: number
    ): Promise<RepoResult<PaginatedResult<Character>>>

    create(input: Character): Promise<RepoResult<Character>>
    update(id: CharacterId, patch: Partial<Character>): Promise<RepoResult<Character>>

    archive(id: CharacterId): Promise<RepoResult<void>>
}
