import { NextFunction, Request, Response } from 'express'
import reviewService from '../services/review.service'

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reviewService.createReview(req.body, req)
    return res.status(201).json({
      status: 'success',
      message: 'Đánh giá sản phẩm thành công',
      result
    })
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'thất bại',
      error
    })
  }
}

export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reviewService.getAllReviews(req)
    return res.status(201).json({
      status: 'success',
      reviews: result
    })
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'thất bại',
      error
    })
  }
}
