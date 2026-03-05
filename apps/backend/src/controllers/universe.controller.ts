import { Request, Response } from 'express'

import { CreateUniverseService } from '../application/services/universe/create-universe.service'
import { GetUniverseByIdService } from '../application/services/universe/get-universe-by-id.service'

export class UniverseController {
    constructor(
        private readonly createUniverseService: CreateUniverseService,
        private readonly getUniverseByIdService: GetUniverseByIdService
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
}
