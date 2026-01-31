import { Router } from 'express'
import { CharacterController } from '../controllers/character.controller'
import { CreateCharacterService } from '../application/services/character/create-character.service'
import { InMemoryCharacterRepository } from '../infra/repositories/in-memory/in-memory-character.repository'
import { SimpleIdGenerator } from '../application/ids/simple-id-generator'
import { GetCharacterByIdService } from '../application/services/character/get-character-by-id.service'
import { ListCharactersService } from '../application/services/character/list-characters.service'
import { UpdateCharacterService } from '../application/services/character/update-character.service'
import { ArchiveCharacterService } from '../application/services/character/archive-character.service'

const router = Router()

//Dependencias
const characterRepository = new InMemoryCharacterRepository()
const idGenerator = new SimpleIdGenerator()

const createCharacterService = new CreateCharacterService(
    characterRepository,
    idGenerator
)

const getCharacterByIdService = new GetCharacterByIdService(
    characterRepository
)

const listCharactersService = new ListCharactersService(
    characterRepository
)

const updateCharacterService = new UpdateCharacterService(
    characterRepository
)

const archiveCharacterService = new ArchiveCharacterService(
    characterRepository
)

const characterController = new CharacterController(
    createCharacterService,
    getCharacterByIdService,
    listCharactersService,
    updateCharacterService,
    archiveCharacterService
)

//Rutas
router.post('/', (req, res) => characterController.create(req, res))
router.get('/', (req, res) => characterController.list(req, res))
router.get('/:id', (req, res) => characterController.getById(req, res))
router.patch('/:id', (req, res) => characterController.update(req, res))
router.delete('/:id', (req, res) => characterController.archive(req, res))

export default router