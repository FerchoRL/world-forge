import { CharacterId } from '@world-forge/domain'
import { IdGenerator } from './id-generator'

export class SimpleIdGenerator implements IdGenerator {
    generate(): CharacterId {
        return `char_${Math.random().toString(36).substring(2, 10)}` as CharacterId 
    }
}