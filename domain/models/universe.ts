import { Status, UniverseId } from '../types'

/**
 * Universe representa el marco estructural donde existen Stories.
 *
 * - No describe eventos narrativos concretos.
 * - No contiene personajes ni tramas.
 * - Define qué es posible, qué no y qué fuerzas dominan el mundo.
 *
 * Relación conceptual:
 * - Universe = tablero
 * - Story = partida sobre ese tablero
 *
 * Invariantes de negocio (definidas por la capa de aplicación/infra):
 * - Campos obligatorios: id, name, status, premise.
 * - Unicidad de name entre estados DRAFT y ACTIVE.
 * - ARCHIVED no bloquea reutilización de name.
 */

export interface Universe {
    /** Identificador único del universe. */
    id: UniverseId

    /** Nombre del marco estructural. */
    name: string

    /**
     * Estado de madurez del universe.
     * Flujo permitido: DRAFT -> ACTIVE -> ARCHIVED, y ARCHIVED -> ACTIVE.
     */
    status: Status

    /**
     * Idea central del mundo.
     * Debe explicar qué hace diferente al universe sin contar eventos de Story.
     */
    premise: string

    /**
     * Leyes estructurales del mundo.
     * Cada regla debe ser atómica e independiente.
     */
    rules?: string[]

    /**
     * Notas libres para exploración conceptual.
     * No forma parte estructural del universe.
     */
    notes?: string
}
