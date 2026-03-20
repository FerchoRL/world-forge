/**
 * Datos de entrada para crear un Universe
 * No incluye ID (se genera en aplicacion)
 * No contiene logica
 * Las validaciones se hacen en el use case
 */

export interface CreateUniverseRequest {
    name: string
    status?: 'DRAFT' | 'ACTIVE'
    premise: string
    rules?: string[]
    notes?: string
}
