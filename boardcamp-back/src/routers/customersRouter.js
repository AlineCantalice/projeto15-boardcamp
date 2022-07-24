import { Router } from 'express'
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
} from '../controllers/customersController.js'

const router = Router()

router.get('/customers', getAllCustomers)
router.get('/customers/:id', getCustomerById)
router.post('/customers', createCustomer)
router.put('/customers/:id', updateCustomer)

export default router
