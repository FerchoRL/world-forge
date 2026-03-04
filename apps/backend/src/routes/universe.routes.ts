import { Router } from 'express'

import { CreateUniverseService } from '../application/services/universe/create-universe.service'
import { SimpleIdGenerator } from '../application/ids/simple-id-generator'
import { UniverseController } from '../controllers/universe.controller'
import { MongoUniverseRepository } from '../infra/repositories/mongo/mongo-universe.repository'

const router = Router()

// Dependencias
const universeRepository = new MongoUniverseRepository()
const idGenerator = new SimpleIdGenerator()

const createUniverseService = new CreateUniverseService(
    universeRepository,
    idGenerator
)

const universeController = new UniverseController(
    createUniverseService
)

// Rutas de Universe
router.post('/', (req, res) => universeController.create(req, res))

export default router
