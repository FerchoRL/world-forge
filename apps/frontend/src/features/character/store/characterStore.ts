import { create } from 'zustand'
import { getApiErrorMessage } from '@/app/api/httpClient'
import { characterService } from '@/app/services/characterService'
import type { CharacterListItem, StatusFilter } from '@/features/character/types'

let listAbortController: AbortController | null = null
// Identifica el último request disparado para ignorar respuestas viejas.
let activeListRequestId = 0

function isAbortError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    error.name === 'AbortError'
  )
}

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
    // Cancela el request anterior cuando cambia búsqueda/filtro.
    listAbortController?.abort()
    listAbortController = new AbortController()
    const requestId = ++activeListRequestId

    set({ charactersLoading: true, charactersError: null })

    try {
      const { limit, searchTerm, statusFilter } = get()
      const response = await characterService.getAll({
        page: 1,
        limit,
        search: searchTerm,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      }, {
        signal: listAbortController.signal,
      })

      // Si llegó una respuesta vieja, no toca el estado.
      if (requestId !== activeListRequestId) {
        return
      }

      set({
        characters: response.characters,
        total: response.total,
        page: 1,
        hasMore: response.characters.length < response.total,
      })
    } catch (error) {
      // Abort no es error funcional, solo un reemplazo de request.
      if (isAbortError(error)) {
        return
      }

      if (requestId !== activeListRequestId) {
        return
      }

      console.error(error)
      set({ charactersError: getApiErrorMessage(error, 'Failed to load characters') })
    } finally {
      if (requestId === activeListRequestId) {
        set({ charactersLoading: false })
        listAbortController = null
      }
    }
  },

  loadMoreCharacters: async () => {
    const { page, limit, characters, total, charactersLoading } = get()

    if (charactersLoading) return
    if (characters.length >= total) return

    set({ charactersLoading: true })

    try {
      const nextPage = page + 1
      const { searchTerm, statusFilter } = get()

      const response = await characterService.getAll({
        page: nextPage,
        limit,
        search: searchTerm,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      })

      set({
        characters: [...characters, ...response.characters],
        page: nextPage,
        hasMore: characters.length + response.characters.length < total,
      })
    } catch (error) {
      console.error(error)
      set({ charactersError: getApiErrorMessage(error, 'Failed to load more characters') })
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
      set({ detailError: getApiErrorMessage(error, 'Failed to load character detail') })
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
}))
