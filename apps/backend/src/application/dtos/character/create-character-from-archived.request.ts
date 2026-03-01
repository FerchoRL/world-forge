import { CategoryName } from '@world-forge/domain'

export interface CreateCharacterFromArchivedRequest {
    name?: string
    identity?: string
    categories?: CategoryName[]
    inspirations?: string[]
    notes?: string
    image?: string
    status?: 'DRAFT' | 'ACTIVE'
}
