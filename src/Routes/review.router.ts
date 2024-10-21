import express from 'express'
import { authentication, authorization } from '../middlewares/auth.middlewares'
import {
  createReview,
  getAllReviews,
  getReportReview,
  reportReview,
  resolveReport
} from '../controllers/review.controller'

const router = express.Router()

router.post('/:pid', authentication, createReview)
router.get('/:pid', getAllReviews)
router.post('/report', authentication, reportReview)
router.get('/get-report', authentication, authorization, getReportReview)
router.put('/resolve-report', authentication, authorization, resolveReport)

export default router
