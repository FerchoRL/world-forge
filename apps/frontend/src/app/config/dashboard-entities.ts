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

type DashboardEntityMeta = Omit<DashboardEntity, 'key'>

const dashboardEntityMetaByModel: Record<DomainModelKey, DashboardEntityMeta> = {
  character: {
    singular: 'Character',
    plural: 'Characters',
    count: 47,
    icon: Users,
    color: 'bg-blue-500',
    to: '/characters',
  },
  characterVariant: {
    singular: 'Character Variant',
    plural: 'Character Variants',
    count: 124,
    icon: UserRound,
    color: 'bg-violet-500',
  },
  story: {
    singular: 'Story',
    plural: 'Stories',
    count: 12,
    icon: BookOpen,
    color: 'bg-green-500',
  },
  universe: {
    singular: 'Universe',
    plural: 'Universes',
    count: 5,
    icon: Globe,
    color: 'bg-amber-500',
  },
  location: {
    singular: 'Location',
    plural: 'Locations',
    count: 83,
    icon: MapPin,
    color: 'bg-red-500',
  },
  arc: {
    singular: 'Arc',
    plural: 'Arcs',
    count: 28,
    icon: GitBranch,
    color: 'bg-teal-500',
  },
}

export const dashboardEntities: DashboardEntity[] = (
  Object.keys(dashboardEntityMetaByModel) as DomainModelKey[]
).map((key) => ({
  key,
  ...dashboardEntityMetaByModel[key],
}))

export const statCards = dashboardEntities.map((entity) => ({
  title: entity.plural,
  count: entity.count,
  icon: entity.icon,
  color: entity.color,
  to: entity.to,
}))

export const quickActions = dashboardEntities.map((entity) => ({
  key: entity.key,
  lineOne: 'New',
  lineTwo: entity.singular,
}))