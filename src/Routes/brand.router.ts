import express from 'express'
import { authentication, authorization } from '../middlewares/auth.middlewares'
import { createBrand, getAllBrands, updateBrand } from '../controllers/brand.controller'

const router = express.Router()

router.post('/', authentication, authorization, createBrand)

router.get('/', getAllBrands)

router.put('/:id', authentication, authorization, updateBrand)

export default router
