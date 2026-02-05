import { create } from 'zustand'
import { characterService } from '@/app/services/characterService'
import type { CharacterListItem, StatusFilter } from '@/features/character/types'
import { filterCharacters } from './character.selectors'

interface CharacterState {
  // ======================
  // List
  // ======================
  characters: CharacterListItem[]
  charactersLoading: boolean
  charactersError: string | null

  // ======================
  // Detail
  // ======================
  selectedCharacter: CharacterListItem | null
  detailLoading: boolean
  detailError: string | null

  // ======================
  // UI Filters (NEW)
  // ======================
  searchTerm: string
  statusFilter: StatusFilter

  // ======================
  // Actions
  // ======================
  fetchCharacters: () => Promise<void>
  fetchCharacterById: (id: string) => Promise<void>
  clearErrors: () => void

  // UI actions
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: StatusFilter) => void

  // ======================
  // Derived
  // ======================
  filteredCharacters: () => CharacterListItem[]
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  // ======================
  // List
  // ======================
  characters: [],
  charactersLoading: false,
  charactersError: null,

  // ======================
  // Detail
  // ======================
  selectedCharacter: null,
  detailLoading: false,
  detailError: null,

  // ======================
  // UI Filters
  // ======================
  searchTerm: '',
  statusFilter: 'ALL',

  // ======================
  // Actions
  // ======================
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

  // ======================
  // UI actions
  // ======================
  setSearchTerm: (term: string) => {
    set({ searchTerm: term })
  },

  setStatusFilter: (status: StatusFilter) => {
    set({ statusFilter: status })
  },

  // ======================
  // Derived
  // ======================
  filteredCharacters: () => {
    const { characters, searchTerm, statusFilter } = get()
    return filterCharacters(characters, searchTerm, statusFilter)
  },
}))
