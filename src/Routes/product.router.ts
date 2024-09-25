import express from 'express'
import { authentication, authorization } from '../middlewares/auth.middlewares'
import { upload, uploadToCloudinary } from '../configs/cloudinary.config'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct
} from '../controllers/product.controller'

const router = express.Router()

router.post(
  '/',
  authentication,
  authorization,
  upload.fields([
    { name: 'thumb', maxCount: 1 },
    { name: 'images', maxCount: 6 }
  ]),
  uploadToCloudinary,
  createProduct
)

router.get('/', getAllProducts)
router.get('/:slug', getProduct)
router.delete('/:slug', authentication, authorization, deleteProduct)
router.put(
  '/:slug',
  authentication,
  authorization,
  upload.fields([
    { name: 'thumb', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  updateProduct
)

export default router
