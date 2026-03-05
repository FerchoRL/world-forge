import { Router } from 'express'

import { CreateUniverseService } from '../application/services/universe/create-universe.service'
import { GetUniverseByIdService } from '../application/services/universe/get-universe-by-id.service'
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

const getUniverseByIdService = new GetUniverseByIdService(
    universeRepository
)

const universeController = new UniverseController(
    createUniverseService,
    getUniverseByIdService
)

// Rutas de Universe
router.post('/', (req, res) => universeController.create(req, res))
router.get('/:id', (req, res) => universeController.getById(req, res))

export default router
