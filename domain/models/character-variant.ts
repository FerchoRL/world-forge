import {
    CharacterId,
    CharacterVariantId,
    StoryId,
    LocationId,
    ArcId
} from '../types'

// Nota: las relaciones pueden ser más complejas en el futuro
// (tipos de relación, fuerza, historia compartida, etc)
export interface CharacterRelationship {
    characterId: CharacterId
    note: string
}

/**
 * El personaje dentro de una Story especifica
 */

export interface CharacterVariant {
    id: CharacterVariantId
    characterId: CharacterId
    storyId: StoryId

    role?: 'PROTAGONIST' | 'ANTAGONIST' | 'SUPPORTING' | 'DEUTERAGONIST' | 'CATALYST' | 'FOIL' | 'MENTOR' | 'WILDCARD'
    //Premise. La idea central del personaje en esta historia
    premise?: string
    //un arco narrativo principal asignado. Los secundarios van en acts y/o beats
    arcId?: ArcId
    //Notas sobre su apariencia física en esta historia
    appearanceNotes?: string
    //Notas sobre su personalidad en esta historia
    personalityNotes?: string

    // Relaciones con otros personajes en esta historia
    relationships?: CharacterRelationship[]
    // Lugares importantes para el personaje en esta historia
    locationsIds?: LocationId[]
}