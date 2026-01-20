import { Status, UniverseId } from '../types'

//Reglas del mundo. No cuenta historia; define marco

export interface Universe {
    id: UniverseId
    name: string
    status: Status
    premise: string
    rules?: string
    notes?: string
}
