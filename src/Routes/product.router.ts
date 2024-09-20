import express from 'express'
import { authentication, authorization } from '../middlewares/auth.middlewares'
import { upload, uploadToCloudinary } from '../configs/cloudinary.config'
import { createProductSpu } from '../controllers/product.controller'

const router = express.Router()

router.post(
  '/',
  authentication,
  authorization,
  upload.fields([
    { name: 'thumb', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  uploadToCloudinary,
  createProductSpu
)

export default router
