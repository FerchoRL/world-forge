import { ApplicationError } from './application-error'

// Error específico para validaciones, como datos de entrada inválidos al crear o actualizar un personaje
export class ValidationError extends ApplicationError {
    constructor(message: string) {
        super(message)
    }
}