import type { RepoError } from '@world-forge/domain'
import { ValidationError } from './validation.error'
import { NotFoundError } from './not-found.error'
import { ConflictError } from './conflict.error'

/**
 * Traduce errores del repositorio (infra) a errores de aplicación (app),
 * manteniendo el code (validation/conflict/not_found) en una clase tipada.
 */
export function mapRepoErrorToAppError(error: RepoError): Error {
  switch (error.code) {
    case 'VALIDATION':
      return new ValidationError(error.message)
    case 'NOT_FOUND':
      return new NotFoundError(error.message)
    case 'CONFLICT':
      return new ConflictError(error.message)
    case 'UNKNOWN':
    default:
      return new Error(error.message)
  }
}