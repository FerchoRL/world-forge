import { ValidationError } from '../errors/validation.error'

export interface UniverseCoreInput {
    name: string
    premise: string
    rules?: string[]
    notes?: string
}

// Valida nombre base del universo
export function validateUniverseName(name: unknown): void {
    if (typeof name !== 'string') {
        throw new ValidationError('Universe name must be a string')
    }

    if (name.trim() === '') {
        throw new ValidationError('Universe name is required')
    }
}

// Valida premisa central del mundo
export function validateUniversePremise(premise: unknown): void {
    if (typeof premise !== 'string') {
        throw new ValidationError('Universe premise must be a string')
    }

    if (premise.trim() === '') {
        throw new ValidationError('Universe premise is required')
    }
}

// Valida reglas estructurales opcionales
export function validateUniverseRules(rules: unknown): void {
    if (rules === undefined) return

    if (!Array.isArray(rules)) {
        throw new ValidationError('Universe rules must be an array')
    }

    const normalizedRules = rules.map((rule) => {
        if (typeof rule !== 'string') {
            throw new ValidationError('Each universe rule must be a string')
        }

        const normalizedRule = rule.trim()
        if (normalizedRule === '') {
            throw new ValidationError('Universe rules cannot contain empty values')
        }

        return normalizedRule.toLowerCase()
    })

    const uniqueRules = new Set(normalizedRules)
    if (uniqueRules.size !== normalizedRules.length) {
        throw new ValidationError('Universe rules must not contain duplicates')
    }
}

// Valida notas opcionales
export function validateUniverseNotes(notes: unknown): void {
    if (notes !== undefined) {
        if (typeof notes !== 'string') {
            throw new ValidationError('Universe notes must be a string')
        }

        if (notes.trim() === '') {
            throw new ValidationError('Universe notes cannot be empty')
        }
    }
}

export function validateUniverseCoreInput(input: UniverseCoreInput): void {
    validateUniverseName(input.name)
    validateUniversePremise(input.premise)
    validateUniverseRules(input.rules)
    validateUniverseNotes(input.notes)
}
