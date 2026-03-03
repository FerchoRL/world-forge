/**
 * DTO regresado al obtener un universe por su ID
 */

import { UniverseDTO } from './universe.dto'

export interface GetUniverseByIdResponse {
    universe: UniverseDTO
}
