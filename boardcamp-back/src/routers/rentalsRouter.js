import { Router } from 'express'
import { getAllRentals } from '../controllers/rentalsController.js'

const router = Router()

router.get('/rentals', getAllRentals)

export default router
