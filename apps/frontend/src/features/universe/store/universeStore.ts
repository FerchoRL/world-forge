import { create } from 'zustand'

import { getApiErrorMessage } from '@/app/api/httpClient'
import { universeService } from '@/app/services/universeService'
import type {
  UniverseListItem,
  UniverseStatusFilter,
} from '@/features/universe/types'

let listAbortController: AbortController | null = null
// Identifica el ultimo request disparado para ignorar respuestas viejas.
let activeListRequestId = 0
let activeDetailRequestId = 0

function isAbortError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    error.name === 'AbortError'
  )
}

interface UniverseState {
  // ======================
  // List
  // ======================
  universes: UniverseListItem[]
  universesLoading: boolean
  universesError: string | null

  // Pagination
  page: number
  limit: number
  total: number
  hasMore: boolean

  // ======================
  // Detail
  // ======================
  selectedUniverse: UniverseListItem | null
  detailLoading: boolean
  detailError: string | null

  // UI Filters
  searchTerm: string
  statusFilter: UniverseStatusFilter

  // Actions
  fetchInitialUniverses: () => Promise<void>
  loadMoreUniverses: () => Promise<void>
  fetchUniverseById: (id: string) => Promise<void>
  clearErrors: () => void

  // UI actions
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: UniverseStatusFilter) => void
}

export const useUniverseStore = create<UniverseState>((set, get) => ({
  // ======================
  // List
  // ======================
  universes: [],
  universesLoading: false,
  universesError: null,

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
  selectedUniverse: null,
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
  fetchInitialUniverses: async () => {
    // Cancela el request anterior cuando cambia busqueda/filtro.
    listAbortController?.abort()
    listAbortController = new AbortController()
    const requestId = ++activeListRequestId

    set({ universesLoading: true, universesError: null })

    try {
      const { limit, searchTerm, statusFilter } = get()
      const response = await universeService.getAll({
        page: 1,
        limit,
        search: searchTerm,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      }, {
        signal: listAbortController.signal,
      })

      // Si llego una respuesta vieja, no toca el estado.
      if (requestId !== activeListRequestId) {
        return
      }

      set({
        universes: response.universes,
        total: response.total,
        page: 1,
        hasMore: response.universes.length < response.total,
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
      set({
        universesError: getApiErrorMessage(error, 'Failed to load universes'),
      })
    } finally {
      if (requestId === activeListRequestId) {
        set({ universesLoading: false })
        listAbortController = null
      }
    }
  },

  loadMoreUniverses: async () => {
    const { page, limit, universes, total, universesLoading } = get()

    if (universesLoading) return
    if (universes.length >= total) return

    set({ universesLoading: true })

    try {
      const nextPage = page + 1
      const { searchTerm, statusFilter } = get()

      const response = await universeService.getAll({
        page: nextPage,
        limit,
        search: searchTerm,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      })

      set({
        universes: [...universes, ...response.universes],
        page: nextPage,
        hasMore: universes.length + response.universes.length < total,
      })
    } catch (error) {
      console.error(error)
      set({
        universesError: getApiErrorMessage(error, 'Failed to load more universes'),
      })
    } finally {
      set({ universesLoading: false })
    }
  },

  fetchUniverseById: async (id: string) => {
    const requestId = ++activeDetailRequestId

    set((state) => ({
      detailLoading: true,
      detailError: null,
      selectedUniverse: state.selectedUniverse?.id === id ? state.selectedUniverse : null,
    }))

    try {
      const universe = await universeService.getById(id)

      if (requestId !== activeDetailRequestId) {
        return
      }

      set({ selectedUniverse: universe })
    } catch (error) {
      if (requestId !== activeDetailRequestId) {
        return
      }

      console.error(error)
      set({
        detailError: getApiErrorMessage(error, 'Failed to load universe detail'),
      })
    } finally {
      if (requestId === activeDetailRequestId) {
        set({ detailLoading: false })
      }
    }
  },

  clearErrors: () => {
    set({
      universesError: null,
      detailError: null,
      selectedUniverse: null,
    })
  },

  // ======================
  // UI actions
  // ======================
  setSearchTerm: (term: string) => {
    set({ searchTerm: term })
  },

  setStatusFilter: (status: UniverseStatusFilter) => {
    set({ statusFilter: status })
  },
}))
