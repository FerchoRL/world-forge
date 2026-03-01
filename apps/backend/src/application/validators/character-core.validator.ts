import { CategoryName, CATEGORIES } from '@world-forge/domain'
import { ValidationError } from '../errors/validation.error'

export interface CharacterCoreInput {
    name: string
    identity: string
    categories: CategoryName[]
    inspirations: string[]
    notes?: string
    image?: string
}

export function validateName(name: unknown): void {
    if (typeof name !== 'string' || name.trim() === '') {
        throw new ValidationError('Character Name is required')
    }
}

export function validateIdentity(identity: unknown): void {
    if (typeof identity !== 'string' || identity.trim() === '') {
        throw new ValidationError('Character Identity is required')
    }
}

export function validateCategories(categories: unknown): void {
    if (!Array.isArray(categories)) {
        throw new ValidationError('Categories must be an array')
    }

    if (categories.length === 0) {
        throw new ValidationError('At least one Category is required')
    }

    const uniqueCategories = new Set(categories)
    if (uniqueCategories.size !== categories.length) {
        throw new ValidationError('Categories must not contain duplicates')
    }

    for (const category of categories) {
        if (
            typeof category !== 'string' ||
            !Object.prototype.hasOwnProperty.call(CATEGORIES, category)
        ) {
            throw new ValidationError(`Category ${String(category)} is not valid`)
        }
    }
}

export function validateInspirations(inspirations: unknown): void {
    if (!Array.isArray(inspirations)) {
        throw new ValidationError('Inspirations must be an array')
    }

    if (inspirations.length === 0) {
        throw new ValidationError('At least one Inspiration is required')
    }

    for (const inspiration of inspirations) {
        if (typeof inspiration !== 'string' || inspiration.trim() === '') {
            throw new ValidationError('Each Inspiration must be a non-empty string')
        }
    }
}

export function validateNotes(notes: unknown): void {
    if (notes !== undefined) {
        if (typeof notes !== 'string') {
            throw new ValidationError('Notes must be a string')
        }

        if (notes.trim() === '') {
            throw new ValidationError('Notes cannot be empty')
        }
    }
}

export function validateImage(image: unknown): void {
    if (image !== undefined && typeof image !== 'string') {
        throw new ValidationError('Image must be a string')
    }
}

export function validateCharacterCoreInput(input: CharacterCoreInput): void {
    validateName(input.name)
    validateIdentity(input.identity)
    validateCategories(input.categories)
    validateInspirations(input.inspirations)
    validateNotes(input.notes)
    validateImage(input.image)
}
