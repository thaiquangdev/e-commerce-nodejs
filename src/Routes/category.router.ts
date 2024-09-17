import express from 'express'
import { authentication, authorization } from '../middlewares/auth.middlewares'
import { createCategoryValidator } from '../middlewares/category.middlewares'
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/category.controller'

const router = express.Router()

router.post('/', authentication, authorization, createCategoryValidator, createCategory)

router.get('/', getAllCategories)

router.put('/:id', authentication, authorization, updateCategory)

router.delete('/:id', authentication, authorization, deleteCategory)

export default router
