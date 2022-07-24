import { Router } from 'express'
import { createRental, getAllRentals } from '../controllers/rentalsController.js'

const router = Router()

router.get('/rentals', getAllRentals)
router.post('/rentals', createRental)

export default router
