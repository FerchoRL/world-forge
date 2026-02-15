import { NextFunction, Request, Response } from 'express'
import { ValidationError } from '../application/errors/validation.error'
import { NotFoundError } from '../application/errors/not-found.error'
import { ConflictError } from '../application/errors/conflict.error'

export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message })
        return
    }

    if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message })
        return
    }

    if (error instanceof ConflictError) {
        res.status(409).json({ error: error.message })
        return
    }

    if (error instanceof Error) {
        console.error('Unexpected error:', error)
        res.status(500).json({ error: error.message })
        return
    }

    console.error('Unknown thrown value:', error)
    res.status(500).json({ error: 'Unexpected error occurred' })
}
