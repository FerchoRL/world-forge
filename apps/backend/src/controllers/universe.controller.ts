import { Request, Response } from 'express'
import { Status } from '@world-forge/domain'

import { CreateUniverseService } from '../application/services/universe/create-universe.service'
import { GetUniverseByIdService } from '../application/services/universe/get-universe-by-id.service'
import { ListUniversesService } from '../application/services/universe/list-universes.service'
import { UpdateUniverseService } from '../application/services/universe/update-universe.service'
import { ChangeUniverseStatusService } from '../application/services/universe/change-universe-status.service'
import { CreateUniverseFromArchivedService } from '../application/services/universe/create-universe-from-archived.service'

export class UniverseController {
    constructor(
        private readonly createUniverseService: CreateUniverseService,
        private readonly getUniverseByIdService: GetUniverseByIdService,
        private readonly listUniversesService: ListUniversesService,
        private readonly updateUniverseService: UpdateUniverseService,
        private readonly changeUniverseStatusService: ChangeUniverseStatusService,
        private readonly createUniverseFromArchivedService: CreateUniverseFromArchivedService
    ) { }

    // Crea un universe nuevo
    async create(req: Request, res: Response): Promise<void> {
        const result = await this.createUniverseService.execute(req.body)
        res.status(201).json(result)
    }

    // Obtiene detalle de universe por id
    async getById(req: Request, res: Response): Promise<void> {
        const result = await this.getUniverseByIdService.execute(req.params.id as string)
        res.status(200).json(result)
    }

    // Lista universes con paginación
    async list(req: Request, res: Response): Promise<void> {
        const page =
            req.query.page !== undefined ? Number(req.query.page) : undefined

        const limit =
            req.query.limit !== undefined ? Number(req.query.limit) : undefined

        const search =
            typeof req.query.search === 'string'
                ? req.query.search
                : undefined

        const status =
            typeof req.query.status === 'string'
                ? (req.query.status as Status)
                : undefined

        const result = await this.listUniversesService.execute({
            page,
            limit,
            search,
            status,
        })

        res.status(200).json(result)
    }

    // Actualiza campos editables del núcleo conceptual
    async update(req: Request, res: Response): Promise<void> {
        const result = await this.updateUniverseService.execute(
            req.params.id as string,
            req.body
        )

        res.status(200).json(result)
    }

    // Cambia status aplicando reglas de transición del dominio
    async changeStatus(req: Request, res: Response): Promise<void> {
        const result = await this.changeUniverseStatusService.execute(
            req.params.id as string,
            req.body?.status
        )

        res.status(200).json(result)
    }

    // Crea un universe nuevo copiando base conceptual de uno archivado
    async createFromArchived(req: Request, res: Response): Promise<void> {
        const result = await this.createUniverseFromArchivedService.execute(
            req.params.id as string
        )

        res.status(201).json(result)
    }
}
