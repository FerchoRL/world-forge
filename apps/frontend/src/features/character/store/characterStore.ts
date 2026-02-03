import { create } from 'zustand'
import { characterService } from '@/app/services/characterService'
import type { CharacterListItem } from '@/features/character/types'

type CharacterDetail = null // placeholder hasta que exista getById real

interface CharacterState {
    //List
    characters: CharacterListItem[]
    charactersLoading: boolean
    charactersError: string | null

    //Detail
    selectedCharacter: CharacterDetail
    detailLoading: boolean
    detailError: string | null

    //Actions
    fetchCharacters: () => Promise<void>
    fetchCharacterById: (id: string) => Promise<void>

    //Opcional
    clearErrors: () => void
}

export const useCharacterStore = create<CharacterState>((set) => ({

    //List
    characters: [],
    charactersLoading: false,
    charactersError: null,

    //Detail
    selectedCharacter: null,
    detailLoading: false,
    detailError: null,

    //Actions
    fetchCharacters: async () => {
        set({ charactersLoading: true, charactersError: null })

        try {
            const characters = await characterService.getAll()
            set({ characters })
        } catch (error) {
            console.error(error)
            set({ charactersError: 'Failed to load characters' })
        } finally {
            set({ charactersLoading: false })
        }
    },

    fetchCharacterById: async (_id: string) => {
        //No implementamos hasta tener el endpoint real
        //Se deja preparado como parte del contrato del store
        set({ detailLoading: true, detailError: null })

        try {
            set({ selectedCharacter: null })
        } catch (error) {
            console.error(error)
            set({ detailError: 'Failed to load character detail' })
        } finally {
            set({ detailLoading: false })
        }
    },

    clearErrors: () => ({ charactersError: null, detailError: null }),
}))
