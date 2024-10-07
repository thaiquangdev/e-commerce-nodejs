import express from 'express'
import { authentication } from '../middlewares/auth.middlewares'
import { createReview, getAllReviews } from '../controllers/review.controller'

const router = express.Router()

router.post('/:pid', authentication, createReview)
router.get('/:pid', getAllReviews)

export default router
