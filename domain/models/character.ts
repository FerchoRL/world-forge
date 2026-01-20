import { CategoryName, CharacterId, Status } from '../types'

/**
 * Character (entity base):
 * Lo que siempre es el personaje, independiente de historia/universo.
 */

export interface Character {
    id: CharacterId
    name: string
    status: Status
    categories: CategoryName[]

    // Nucleo/Patreon del personaje (no historia, no universo) “¿Cómo es por dentro?”
    identity: string

    //Ingredientes, inspiraciones de la mezcla (Hu tao, Briar, etc)
    inspirations: string[]

    //Cajon de ideas sueltas
    notes?: string

}