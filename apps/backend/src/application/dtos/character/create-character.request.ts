import { CategoryName, Status } from '@world-forge/domain'

/**
 * Datos de entrada para crear un Character
 * No incluye ID (se genera en aplicacion)
 * No contiene logica
 * Las validaciones se hacen en el use case
 */

export interface CreateCharacterRequest {
    name: string
    status: Status
    categories: CategoryName[]
    identity: string
    inspirations: string[]
    notes?: string
}