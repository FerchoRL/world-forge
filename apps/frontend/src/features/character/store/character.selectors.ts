import type { CharacterApiDTO, StatusFilter } from '../types'

/**
 * Normaliza texto para búsqueda
 */
function normalize(value: string): string {
  return value.toLowerCase().trim()
}

/**
 * Coincidencia por texto:
 * - name
 * - identity
 * - inspirations[]
 * - categories[]
 */
export function matchesSearch(
  character: CharacterApiDTO,
  searchTerm: string
): boolean {
  const raw = searchTerm.trim()
  if (!raw) return true

  const term = normalize(raw)

  const nameMatch = normalize(character.name).includes(term)
  const identityMatch = normalize(character.identity).includes(term)

  const inspirationsMatch = character.inspirations.some(i =>
    normalize(i).includes(term)
  )

  const categoriesMatch = character.categories.some(c =>
    normalize(String(c)).includes(term)
  )

  return (
    nameMatch ||
    identityMatch ||
    inspirationsMatch ||
    categoriesMatch
  )
}

/**
 * Coincidencia por status
 */
export function matchesStatus(
  character: CharacterApiDTO,
  status: StatusFilter
): boolean {
  if (status === 'ALL') return true
  return character.status === status
}

/**
 * Filtro combinado (status + search)
 */
export function filterCharacters(
  characters: CharacterApiDTO[],
  searchTerm: string,
  status: StatusFilter
): CharacterApiDTO[] {
  return characters.filter(
    c => matchesStatus(c, status) && matchesSearch(c, searchTerm)
  )
}
