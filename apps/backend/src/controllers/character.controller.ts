import { Request, Response } from 'express'
import { CreateCharacterService } from '../application/services/character/create-character.service'
import { GetCharacterByIdService } from '../application/services/character/get-character-by-id.service'
import { ListCharactersService } from '../application/services/character/list-characters.service'
import { UpdateCharacterService } from '../application/services/character/update-character.service'
import { ArchiveCharacterService } from '../application/services/character/archive-character.service'

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
        const result = await this.createCharacterService.execute(req.body)
        res.status(201).json(result)
    }

    //GET /characters/:id
    async getById(req: Request, res: Response): Promise<void> {
        const result = await this.getCharacterByIdService.execute(req.params.id as string)
        res.status(200).json(result)
    }

    //GET /characters
    async list(req: Request, res: Response): Promise<void> {
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
    }

    //PATCH /characters/:id
    async update(req: Request, res: Response): Promise<void> {
        // Status transitions (publish/unpublish/archive) will be handled by explicit domain actions.
        const result = await this.updateCharacterService.execute(
            req.params.id as any,
            req.body
        )
        res.status(200).json(result)
    }

    //DELETE /characters/:id

    async archive(req: Request, res: Response): Promise<void> {
        const result = await this.archiveCharacterService.execute(
            req.params.id as any
        )
        res.status(200).json(result)
    }
}
