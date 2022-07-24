import { Router } from 'express'
import {
  createRental,
  deleteRental,
  getAllRentals,
  returnRental,
} from '../controllers/rentalsController.js'

const router = Router()

router.get('/rentals', getAllRentals)
router.post('/rentals', createRental)
router.post('/rentals/:id/return', returnRental)
router.delete('/rentals/:id', deleteRental)

export default router
