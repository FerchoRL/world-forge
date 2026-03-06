import { useEffect, useMemo, useState } from 'react'
import { characterService } from '@/app/services/characterService'
import { universeService } from '@/app/services/universeService'
import {
  buildDashboardEntities,
  buildQuickActions,
  buildStatCards,
} from './dashboard-entities'

export function useDashboardStats() {
  const [characterCount, setCharacterCount] = useState(0)
  const [universeCount, setUniverseCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchCharacterCount = async () => {
      try {
        const response = await characterService.getAll({ page: 1, limit: 1 })
        if (!cancelled) {
          setCharacterCount(response.total)
        }
      } catch {
        if (!cancelled) {
          setCharacterCount(0)
        }
      }
    }

    const fetchUniverseCount = async () => {
      try {
        const response = await universeService.getAll({ page: 1, limit: 1 })
        if (!cancelled) {
          setUniverseCount(response.total)
        }
      } catch {
        if (!cancelled) {
          setUniverseCount(0)
        }
      }
    }

    fetchCharacterCount()
    fetchUniverseCount()

    return () => {
      cancelled = true
    }
  }, [])

  const dashboardEntities = useMemo(
    () => buildDashboardEntities(characterCount, universeCount),
    [characterCount, universeCount]
  )

  const statCards = useMemo(
    () => buildStatCards(dashboardEntities),
    [dashboardEntities]
  )

  const quickActions = useMemo(
    () => buildQuickActions(dashboardEntities),
    [dashboardEntities]
  )

  return {
    dashboardEntities,
    statCards,
    quickActions,
  }
}