import { CategoryName } from '@world-forge/domain'

export interface UpdateCharacterRequest {
    name?: string
    categories?: CategoryName[]
    identity?: string
    inspirations?: string[]
    notes?: string
}
