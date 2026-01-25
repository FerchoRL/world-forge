import { CharacterId} from '@world-forge/domain'

export interface IdGenerator {
    generate(): CharacterId
}