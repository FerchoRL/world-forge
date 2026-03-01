import { ApplicationError } from './application-error'

// Error específico para conflictos, como intentar crear un recurso que ya existe
export class ConflictError extends ApplicationError {
  constructor(message: string) {
    super(message)
  }
}
