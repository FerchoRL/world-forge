import { Character } from '../models'
import { CategoryName, CharacterId } from '../types'
import { RepoResult } from './repo-errors'
import { Status } from '../types'

//Resultado paginado generico
export interface PaginatedResult<T> {
    items: T[]
    total: number
}

export interface ListCharactersParams {
    page: number
    limit: number
    search?: string
    status?: Status
}

export interface CreateCharacterInput {
    id: CharacterId
    name: string
    identity: string
    categories: CategoryName[]
    inspirations: string[]
    status: 'DRAFT' | 'ACTIVE'
    notes?: string
    image?: string
}

export interface UpdateCharacterCoreInput {
    name?: string
    identity?: string
    categories?: CategoryName[]
    inspirations?: string[]
    notes?: string
    image?: string
}

//Repository responde : como leo y guardo entidades del dominio (guardar, leer, actualizar, archivar)
export interface CharacterRepository {
    getById(id: CharacterId): Promise<RepoResult<Character | null>>
    list(params: ListCharactersParams): Promise<RepoResult<PaginatedResult<Character>>>

    create(input: CreateCharacterInput): Promise<RepoResult<Character>>

    // No se permite update parcial genérico.
    // Las modificaciones deben respetar invariantes y transiciones del dominio.
    // Actualiza propiedades editables del núcleo conceptual
    updateCore(id: CharacterId, input: UpdateCharacterCoreInput): Promise<RepoResult<Character>>

    changeStatus(id: CharacterId, status: 'ACTIVE' | 'ARCHIVED'): Promise<RepoResult<Character>>
}
