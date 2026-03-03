import { Status } from '../types'

export function canTransitionUniverseStatus(from: Status, to: Status): boolean {
    if (from === 'DRAFT' && to === 'ACTIVE') return true
    if (from === 'ACTIVE' && to === 'ARCHIVED') return true
    if (from === 'ARCHIVED' && to === 'ACTIVE') return true

    return false
}
