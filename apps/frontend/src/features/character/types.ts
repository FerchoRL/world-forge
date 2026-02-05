import { Status } from '@world-forge/domain'
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
  categories: string[]
  identity: string
  inspirations: string[]
  notes?: string
}

// Respuesta al listar personajes
export interface ListCharactersApiResponse {
  characters: CharacterApiDTO[]
}

// Respuesta al obtener un personaje por su ID

export interface GetCharacterByIdApiResponse {
  character: CharacterApiDTO
}

/**
 * ------------
 * View Models
 * ------------
 * Tipos pensados para la UI
 */

export type StatusFilter =  Status | 'ALL';

export interface CharacterListItem {
  id: string
  name: string
  status: Status
  categories: string[]
  identity: string
  inspirations: string[]
  notes?: string
}