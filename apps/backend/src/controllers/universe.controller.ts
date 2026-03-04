import { Request, Response } from 'express'

import { CreateUniverseService } from '../application/services/universe/create-universe.service'

export class UniverseController {
    constructor(
        private readonly createUniverseService: CreateUniverseService
    ) { }

    // Crea un universe nuevo
    async create(req: Request, res: Response): Promise<void> {
        const result = await this.createUniverseService.execute(req.body)
        res.status(201).json(result)
    }
}
