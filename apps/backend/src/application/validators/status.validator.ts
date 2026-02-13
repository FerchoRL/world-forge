import { Status } from '@world-forge/domain'

/**
 * Validador de Status reutilizable para cualquier entidad editable.
 * No modifica el dominio.
 */
export function isValidStatus(value: unknown): value is Status {
    return (
        value === 'DRAFT' ||
        value === 'ACTIVE' ||
        value === 'ARCHIVED'
    )
}
