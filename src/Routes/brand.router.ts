import express from 'express'
import { authentication, authorization } from '../middlewares/auth.middlewares'
import { upload } from '../configs/cloudinary.config'
import { createBrand, getAllBrands, updateBrand } from '../controllers/brand.controller'

const router = express.Router()

router.post('/', authentication, authorization, upload.single('image'), createBrand)

router.get('/', getAllBrands)

router.put('/:id', authentication, authorization, updateBrand)

export default router
