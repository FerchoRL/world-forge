import { useEffect, useMemo, useState } from 'react'
import { characterService } from '@/app/services/characterService'
import {
  buildDashboardEntities,
  buildQuickActions,
  buildStatCards,
} from './dashboard-entities'

export function useDashboardStats() {
  const [characterCount, setCharacterCount] = useState(0)

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

    fetchCharacterCount()

    return () => {
      cancelled = true
    }
  }, [])

  const dashboardEntities = useMemo(
    () => buildDashboardEntities(characterCount),
    [characterCount]
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