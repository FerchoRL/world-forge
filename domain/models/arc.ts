import { ActId, ArcId, CharacterId, StoryId, BeatId} from '../types'

export interface Beat{
    id: BeatId
    summary: string
}

export interface Act{
    id: ActId
    order: 1 | 2 | 3 | 4 | 5
    summary: string
    beats?: Beat[]
}

//Arco del personaje a lo largo de una historia
export interface Arc{
    id: ArcId
    storyId: StoryId
    characterId: CharacterId
    title: string
    premise: string
    inspiration?: string[]
    acts: Act[]
}