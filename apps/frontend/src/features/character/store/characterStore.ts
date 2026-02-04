import { create } from 'zustand'
import { characterService } from '@/app/services/characterService'
import type { CharacterListItem } from '@/features/character/types'

interface CharacterState {
  // List
  characters: CharacterListItem[]
  charactersLoading: boolean
  charactersError: string | null

  // Detail
  selectedCharacter: CharacterListItem | null
  detailLoading: boolean
  detailError: string | null

  // Actions
  fetchCharacters: () => Promise<void>
  fetchCharacterById: (id: string) => Promise<void>
  clearErrors: () => void
}

export const useCharacterStore = create<CharacterState>((set) => ({
  // List
  characters: [],
  charactersLoading: false,
  charactersError: null,

  // Detail
  selectedCharacter: null,
  detailLoading: false,
  detailError: null,

  // Actions
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

  fetchCharacterById: async (id: string) => {
    set({ detailLoading: true, detailError: null })

    try {
      const character = await characterService.getById(id)
      set({ selectedCharacter: character })
    } catch (error) {
      console.error(error)
      set({ detailError: 'Failed to load character detail' })
    } finally {
      set({ detailLoading: false })
    }
  },

  clearErrors: () => {
    set({
      charactersError: null,
      detailError: null,
      selectedCharacter: null,
    })
  },
}))
