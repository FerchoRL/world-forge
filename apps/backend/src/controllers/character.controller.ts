import { Request, Response } from 'express'
import { CreateCharacterService } from '../application/services/character/create-character.service'
import { GetCharacterByIdService } from '../application/services/character/get-character-by-id.service'
import { ListCharactersService } from '../application/services/character/list-characters.service'
import { UpdateCharacterService } from '../application/services/character/update-character.service'
import { ChangeCharacterStatusService } from '../application/services/character/change-character-status.service'
import { CreateCharacterFromArchivedService } from '../application/services/character/create-character-from-archived.service'

export class CharacterController {
    constructor(
        private readonly createCharacterService: CreateCharacterService,
        private readonly getCharacterByIdService: GetCharacterByIdService,
        private readonly listCharactersService: ListCharactersService,
        private readonly updateCharacterService: UpdateCharacterService,
        private readonly changeCharacterStatusService: ChangeCharacterStatusService,
        private readonly createCharacterFromArchivedService: CreateCharacterFromArchivedService
    ) { }

    // Crea un character nuevo
    async create(req: Request, res: Response): Promise<void> {
        const result = await this.createCharacterService.execute(req.body)
        res.status(201).json(result)
    }

    // Obtiene detalle de character por id
    async getById(req: Request, res: Response): Promise<void> {
        const result = await this.getCharacterByIdService.execute(req.params.id as string)
        res.status(200).json(result)
    }

    // Lista characters con paginación
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

    // Actualiza campos editables del núcleo conceptual
    async update(req: Request, res: Response): Promise<void> {
        const result = await this.updateCharacterService.execute(
            req.params.id as any,
            req.body
        )
        res.status(200).json(result)
    }

    // Cambia status aplicando reglas de transición del dominio
    async changeStatus(req: Request, res: Response): Promise<void> {
        const result = await this.changeCharacterStatusService.execute(
            req.params.id as string,
            req.body?.status
        )
        res.status(200).json(result)
    }

    // Crea un character nuevo copiando base conceptual de uno archivado
    async createFromArchived(req: Request, res: Response): Promise<void> {
        const result = await this.createCharacterFromArchivedService.execute(
            req.params.id as string,
            req.body
        )
        res.status(201).json(result)
    }
}
