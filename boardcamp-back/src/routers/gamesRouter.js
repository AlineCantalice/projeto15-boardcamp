import { createGame, getAllGames } from '../controllers/gamesController.js'
import { Router } from 'express'

const router = Router()

router.get('/games', getAllGames)
router.post('/games', createGame)

export default router
