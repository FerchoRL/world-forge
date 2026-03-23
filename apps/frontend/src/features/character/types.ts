import type { CategoryName, Status } from '@world-forge/domain'
/**
 * ===============================
 * Character — Frontend DTOs
 * ===============================
 *
 * Estos tipos:
 * - NO son dominio
 * - NO contienen lógica
 * - Representan datos que cruzan HTTP
 * - Son controlados por el frontend
 */

/**
 * --------
 * API DTOs
 * --------
 * Forma exacta de lo que devuelve el backend
 */

export interface CharacterApiDTO {
  id: string
  name: string
  status: Status
  categories: CategoryName[]
  identity: string
  inspirations: string[]
  notes?: string
  image?: string
}

export interface CreateCharacterRequest {
  name: string
  status?: 'DRAFT' | 'ACTIVE'
  categories: CategoryName[]
  identity: string
  inspirations: string[]
  notes?: string
  image?: string
}

export interface UpdateCharacterRequest {
  name?: string
  categories?: CategoryName[]
  identity?: string
  inspirations?: string[]
  notes?: string
  image?: string
}

// Respuesta al listar personajes
export interface ListCharactersApiResponse {
  characters: CharacterApiDTO[]
  page: number
  limit: number
  total: number
}

export interface ListCharactersQuery {
  page?: number
  limit?: number
  search?: string
  status?: Status
}

// Respuesta al obtener un personaje por su ID

export interface GetCharacterByIdApiResponse {
  character: CharacterApiDTO
}

export interface CreateCharacterApiResponse {
  character: CharacterApiDTO
}

export interface UpdateCharacterApiResponse {
  character: CharacterApiDTO
}

/**
 * ------------
 * View Models
 * ------------
 * Tipos pensados para la UI
 */

export type StatusFilter = Status | 'ALL'

export interface CharacterListItem {
  id: string
  name: string
  status: Status
  categories: CategoryName[]
  identity: string
  inspirations: string[]
  notes?: string
  image?: string
}

// Respuesta paginada al listar personajes
export interface PaginatedCharactersResponse {
  characters: CharacterListItem[]
  page: number
  limit: number
  total: number
}