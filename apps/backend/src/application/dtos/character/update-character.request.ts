import { CategoryName, Status } from '@world-forge/domain'

export interface UpdateCharacterRequest {
    name?: string
    status?: Status
    categories?: CategoryName[]
    identity?: string
    inspirations?: string[]
    notes?: string
}
