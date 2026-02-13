import { Request, Response } from 'express'
import { CreateCharacterService } from '../application/services/character/create-character.service'
import { ValidationError } from '../application/errors/validation.error'
import { CharacterRepository } from '@world-forge/domain'
import { IdGenerator } from '../application/ids/id-generator'
import { GetCharacterByIdService } from '../application/services/character/get-character-by-id.service'
import { ListCharactersService } from '../application/services/character/list-characters.service'
import { UpdateCharacterService } from '../application/services/character/update-character.service'
import { ArchiveCharacterService } from '../application/services/character/archive-character.service'
import { NotFoundError } from '../application/errors/not-found.error'
import { ConflictError } from '../application/errors/conflict.error'

export class CharacterController {
    constructor(
        private readonly createCharacterService: CreateCharacterService,
        private readonly getCharacterByIdService: GetCharacterByIdService,
        private readonly listCharactersService: ListCharactersService,
        private readonly updateCharacterService: UpdateCharacterService,
        private readonly archiveCharacterService: ArchiveCharacterService
    ) { }

    //POST /characters
    async create(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.createCharacterService.execute(req.body)
            res.status(201).json(result)
        } catch (error: unknown) {
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
    }

    //GET /characters/:id
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.getCharacterByIdService.execute(req.params.id as string)
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).json({ error: error.message })
            } else {
                res.status(500).json({ error: 'Internal Server Error' })
            }
        }
    }

    //GET /characters
    async list(req: Request, res: Response): Promise<void> {
        try {
            // Obtener los parámetros de consulta para paginación
            const page =
                req.query.page !== undefined ? Number(req.query.page) : undefined

            const limit =
                req.query.limit !== undefined ? Number(req.query.limit) : undefined

            const result = await this.listCharactersService.execute({
                page,
                limit,
            })

            res.status(200).json(result)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    //PATCH /characters/:id
    async update(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.updateCharacterService.execute(
                req.params.id as any,
                req.body
            )
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).json({ message: error.message })
                return
            }

            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    //DELETE /characters/:id

    async archive(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.archiveCharacterService.execute(
                req.params.id as any
            )
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).json({ message: error.message })
                return
            }

            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}
