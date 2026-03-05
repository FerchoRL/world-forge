import type { UniverseStatus } from '@/features/universe/types'

const STATUS_CLASSES: Record<UniverseStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  IN_DEVELOPMENT: 'bg-blue-100 text-blue-800',
  DRAFT: 'bg-yellow-100 text-yellow-800',
  ARCHIVED: 'bg-zinc-100 text-zinc-600',
}

const STATUS_LABELS: Record<UniverseStatus, string> = {
  ACTIVE: 'Active',
  IN_DEVELOPMENT: 'In Development',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
}

export function getUniverseStatusClass(status: UniverseStatus): string {
  return STATUS_CLASSES[status]
}

export function getUniverseStatusLabel(status: UniverseStatus): string {
  return STATUS_LABELS[status]
}
