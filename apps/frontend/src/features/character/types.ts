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
  status: string
  categories: string[]
  identity: string
  inspirations: string[]
  notes?: string
}

export interface ListCharactersApiResponse {
  characters: CharacterApiDTO[]
}

/**
 * ------------
 * View Models
 * ------------
 * Tipos pensados para la UI
 */

export interface CharacterListItem {
  id: string
  name: string
  status: string
  categories: string[]
  identity: string
  inspirations: string[]
  notes?: string
}