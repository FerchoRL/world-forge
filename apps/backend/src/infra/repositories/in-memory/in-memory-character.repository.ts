import {
    Character,
    CharacterId,
    CreateCharacterInput,
    CharacterRepository,
    UpdateCharacterCoreInput
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
    async list(
        page: number,
        limit: number
    ): Promise<RepoResult<{ items: Character[]; total: number }>> {
        const characters = Array.from(this.store.values())
        const total = characters.length
        const start = (page - 1) * limit
        const items = characters.slice(start, start + limit)

        return {
            ok: true,
            data: {
                items,
                total
            }
        }
    }

    //Crear nuevo personaje
    async create(input: CreateCharacterInput): Promise<RepoResult<Character>> {
        const character: Character = {
            id: input.id,
            name: input.name,
            status: input.status,
            categories: input.categories,
            identity: input.identity,
            inspirations: input.inspirations,
            notes: input.notes,
            image: input.image,
        }

        this.store.set(input.id, character)
        return { ok: true, data: character }
    }

    //Actualizar personaje existente
    async updateCore(
        id: CharacterId,
        patch: UpdateCharacterCoreInput
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

    async changeStatus(
        id: CharacterId,
        status: 'ACTIVE' | 'ARCHIVED'
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

        const updated: Character = { ...existing, status }
        this.store.set(id, updated)

        return { ok: true, data: updated }
    }

}