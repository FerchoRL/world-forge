import { CharacterId, UniverseId } from '@world-forge/domain'

export interface IdGenerator {
    generateCharacterId(): CharacterId
    generateUniverseId(): UniverseId
}