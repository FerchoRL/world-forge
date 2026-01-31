
/**
 * DTO regresado al obtener un personaje por su ID
 */

import { CharacterDTO } from "./character.dto";

export interface GetCharacterByIdResponse {
    character: CharacterDTO
}