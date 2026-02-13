import { CharacterRepository, CharacterId } from "@world-forge/domain";
import { CharacterDTO } from "../../dtos/character/character.dto";
import { CharacterMapper } from "../../mappers/character.mapper";
import { ValidationError } from "../../errors/validation.error";
import { GetCharacterByIdResponse } from "../../dtos/character/get-character-by-id.response";

export class GetCharacterByIdService {
    constructor(private readonly repository: CharacterRepository) { }

    async execute(id: CharacterId): Promise<GetCharacterByIdResponse> {
        if (!id) {
            throw new ValidationError("Character id is required");
        }

        const result = await this.repository.getById(id);

        if (!result.ok || !result.data) {
            throw new ValidationError(`Character ${id} not found`);
        }

        return { character: CharacterMapper.toDTO(result.data) };
    }
}
