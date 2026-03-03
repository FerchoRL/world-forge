import { Status, UniverseId } from '@world-forge/domain'

/**
 * Representacion de salida de un Universe
 * No es el modelo de dominio
 * No contiene logica
 * Refleja el estado persistido del Universe
 */

export interface UniverseDTO {
    id: UniverseId
    name: string
    status: Status
    premise: string
    rules?: string[]
    notes?: string
}
