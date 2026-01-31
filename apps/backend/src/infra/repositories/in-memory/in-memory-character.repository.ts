import {
    Character,
    CharacterId,
    CharacterRepository,
    Status
} from '@world-forge/domain'

import { RepoResult } from '@world-forge/domain'

/**
 * Simula Persistencia en memoria para personajes
 * Implementa CharacterRepository
 * No contiene logica de negocio
 * Devuelve RepoResult
 */

export class InMemoryCharacterRepository implements CharacterRepository {

    private readonly store = new Map<CharacterId, Character>()

    //Obtener personaje por id
    async getById(id: CharacterId): Promise<RepoResult<Character | null>> {
        const character = this.store.get(id) ?? null
        return { ok: true, data: character }
    }

    //Listar todos los personajes
    async list(): Promise<RepoResult<Character[]>> {
        const characters = Array.from(this.store.values())
        return { ok: true, data: characters }
    }

    //Crear nuevo personaje
    async create(input: Character): Promise<RepoResult<Character>> {
        this.store.set(input.id, input)
        return { ok: true, data: input }
    }

    //Actualizar personaje existente
    async update(
        id: CharacterId,
        patch: Partial<Character>
    ): Promise<RepoResult<Character>> {
        const existing = this.store.get(id)
        if (!existing) {
            return {
                ok: false,
                error: {
                    code: 'NOT_FOUND',
                    message: `Character with id ${id} not found`
                }
            }
        }

        const updated: Character = { ...existing, ...patch }

        this.store.set(id, updated)

        return { ok: true, data: updated }

    }

    //Archivar personaje (cambiar estado a ARCHIVED)
    async archive(id: CharacterId): Promise<RepoResult<void>> {
        const existing = this.store.get(id)
        if (!existing) {
            return {
                ok: false,
                error: {
                    code: 'NOT_FOUND',
                    message: `Character with id ${id} not found`
                }
            }
        }
        const archived: Character = { ...existing, status: 'ARCHIVED' }
        this.store.set(id, archived)
        return { ok: true, data: undefined }
    }
}