import { Router } from 'express'
import { CharacterController } from '../controllers/character.controller'
import { CreateCharacterService } from '../application/services/character/create-character.service'
import { InMemoryCharacterRepository } from '../infra/repositories/in-memory/in-memory-character.repository'
import { SimpleIdGenerator } from '../application/ids/simple-id-generator'
import { GetCharacterByIdService } from '../application/services/character/get-character-by-id.service'
import { ListCharactersService } from '../application/services/character/list-characters.service'
import { UpdateCharacterService } from '../application/services/character/update-character.service'
import { MongoCharacterRepository } from '../infra/repositories/mongo/mongo-character.repository'
import { ChangeCharacterStatusService } from '../application/services/character/change-character-status.service'
import { CreateCharacterFromArchivedService } from '../application/services/character/create-character-from-archived.service'

const router = Router()

//Dependencias
//Repo de personajes en memoria
//const characterRepository = new InMemoryCharacterRepository()
//Repo de personajes con MongoDB
const characterRepository = new MongoCharacterRepository()
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

const changeCharacterStatusService = new ChangeCharacterStatusService(
    characterRepository
)

const createCharacterFromArchivedService = new CreateCharacterFromArchivedService(
    characterRepository,
    idGenerator
)

const characterController = new CharacterController(
    createCharacterService,
    getCharacterByIdService,
    listCharactersService,
    updateCharacterService,
    changeCharacterStatusService,
    createCharacterFromArchivedService
)

//Rutas de Character (cada una delega en CharacterController)
// Crea un character nuevo
router.post('/', (req, res) => characterController.create(req, res))
// Lista characters paginados
router.get('/', (req, res) => characterController.list(req, res))
// Obtiene un character por id
router.get('/:id', (req, res) => characterController.getById(req, res))
// Crea un character nuevo usando como base uno archivado
router.post('/:id/create-from-archived', (req, res) => characterController.createFromArchived(req, res))
// Actualiza el núcleo conceptual de un character
router.patch('/:id', (req, res) => characterController.update(req, res))
// Cambia status (ACTIVE/ARCHIVED) respetando reglas de transición
router.patch('/:id/status', (req, res) => characterController.changeStatus(req, res))

export default router