import { ApplicationError } from './application-error'

export class ValidationError extends ApplicationError {
    constructor(message: string) {
        super(message)
    }
}