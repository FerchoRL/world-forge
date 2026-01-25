import { CategoryName, CharacterId, Status} from '@world-forge/domain'

/**
 * Representacion de salida de un Character
 * No es el modelo de dominio
 * No contiene logica
 * Refleja el estado persistido del Character
 */

export interface CharacterDTO {
    id: CharacterId
    name: string
    status: Status
    categories: CategoryName[]
    identity: string
    inspirations: string[]
    notes?: string
}