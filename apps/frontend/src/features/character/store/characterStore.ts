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

  // Pagination (NEW)
  page: number
  limit: number
  total: number
  hasMore: boolean

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
  fetchInitialCharacters: () => Promise<void>
  loadMoreCharacters: () => Promise<void>
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
  // Pagination
  // ======================
  page: 1,
  limit: 10,
  total: 0,
  hasMore: true,

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
  fetchInitialCharacters: async () => {
    set({ charactersLoading: true, charactersError: null })

    try {
      const { limit } = get()
      const response = await characterService.getAll({ page: 1, limit })
      set({
        characters: response.characters,
        total: response.total,
        page: 1,
        hasMore: response.characters.length < response.total,
      })
    } catch (error) {
      console.error(error)
      set({ charactersError: 'Failed to load characters' })
    } finally {
      set({ charactersLoading: false })
    }
  },

  loadMoreCharacters: async () => {
    const { page, limit, characters, total, charactersLoading } = get()

    if (charactersLoading) return
    if (characters.length >= total) return

    set({ charactersLoading: true })

    try {
      const nextPage = page + 1

      const response = await characterService.getAll({
        page: nextPage,
        limit,
      })

      set({
        characters: [...characters, ...response.characters],
        page: nextPage,
        hasMore: characters.length + response.characters.length < total,
      })
    } catch (error) {
      console.error(error)
      set({ charactersError: 'Failed to load more characters' })
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
