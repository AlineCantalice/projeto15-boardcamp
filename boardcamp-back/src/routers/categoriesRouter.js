import {
  createCategory,
  getAllCategories,
} from '../controllers/categoriesControllers.js'
import { Router } from 'express'

const router = Router()

router.get('/categories', getAllCategories)
router.post('/categories', createCategory)

export default router
