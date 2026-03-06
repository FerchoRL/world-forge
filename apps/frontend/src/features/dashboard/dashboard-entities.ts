import type { ComponentType } from 'react'
import {
  BookOpen,
  GitBranch,
  Globe,
  MapPin,
  UserRound,
  Users,
} from 'lucide-react'
import type {
  Arc,
  Character,
  CharacterVariant,
  Location,
  Story,
  Universe,
} from '@world-forge/domain'

type DomainModelMap = {
  character: Character
  characterVariant: CharacterVariant
  story: Story
  universe: Universe
  location: Location
  arc: Arc
}

export type DomainModelKey = keyof DomainModelMap

export type DashboardEntity = {
  key: DomainModelKey
  singular: string
  plural: string
  count: number
  color: string
  icon: ComponentType<{ className?: string }>
  to?: string
}

type DashboardEntityMeta = Omit<DashboardEntity, 'key' | 'count'>

const dashboardEntityMetaByModel: Record<DomainModelKey, DashboardEntityMeta> = {
  character: {
    singular: 'Character',
    plural: 'Characters',
    icon: Users,
    color: 'bg-blue-500',
    to: '/characters',
  },
  characterVariant: {
    singular: 'Character Variant',
    plural: 'Character Variants',
    icon: UserRound,
    color: 'bg-violet-500',
  },
  story: {
    singular: 'Story',
    plural: 'Stories',
    icon: BookOpen,
    color: 'bg-green-500',
  },
  universe: {
    singular: 'Universe',
    plural: 'Universes',
    icon: Globe,
    color: 'bg-amber-500',
    to: '/universes',
  },
  location: {
    singular: 'Location',
    plural: 'Locations',
    icon: MapPin,
    color: 'bg-red-500',
  },
  arc: {
    singular: 'Arc',
    plural: 'Arcs',
    icon: GitBranch,
    color: 'bg-teal-500',
  },
}

const modelOrder: DomainModelKey[] = [
  'character',
  'characterVariant',
  'story',
  'universe',
  'location',
  'arc',
]

export function buildDashboardEntities(characterCount: number, universeCount: number): DashboardEntity[] {
  return modelOrder.map((key) => ({
    key,
    ...dashboardEntityMetaByModel[key],
    count:
      key === 'character'
        ? characterCount
        : key === 'universe'
        ? universeCount
        : 0,
  }))
}

export function buildStatCards(entities: DashboardEntity[]) {
  return entities.map((entity) => ({
    title: entity.plural,
    count: entity.count,
    icon: entity.icon,
    color: entity.color,
    to: entity.to,
  }))
}

export function buildQuickActions(entities: DashboardEntity[]) {
  return entities.map((entity) => ({
    key: entity.key,
    lineOne: 'New',
    lineTwo: entity.singular,
  }))
}