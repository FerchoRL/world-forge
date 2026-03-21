import type { CategoryName } from '@world-forge/domain'

export type CharacterCategoryGroup = 'Narrativa' | 'Tono' | 'Concepto'

export const CHARACTER_CATEGORY_GROUPS: Array<{
  group: CharacterCategoryGroup
  items: CategoryName[]
}> = [
  {
    group: 'Narrativa',
    items: ['PersonajeTrágico', 'Protector', 'Sobreviviente', 'Mentor'],
  },
  {
    group: 'Tono',
    items: ['Oscuro', 'Emocional', 'Tranquilo', 'Caótico', 'Melancólico'],
  },
  {
    group: 'Concepto',
    items: ['LealtadAbsoluta', 'Dualidad', 'Resiliencia', 'AmorComoMotor', 'Caida'],
  },
]