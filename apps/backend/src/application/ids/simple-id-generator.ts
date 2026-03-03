import { CharacterId, UniverseId } from '@world-forge/domain'
import { ulid } from 'ulid'
import { IdGenerator } from './id-generator'

export class SimpleIdGenerator implements IdGenerator {
    generateCharacterId(): CharacterId {
        return `CHAR_${ulid()}` as CharacterId
    }

    generateUniverseId(): UniverseId {
        return `UNIVERSE_${ulid()}` as UniverseId
    }
}