import { ApplicationError } from './application-error'

// Error específico para recursos no encontrados, como buscar un personaje por ID que no existe
export class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message)
  }
}