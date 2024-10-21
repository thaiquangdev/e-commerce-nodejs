import { NextFunction, Request, Response } from 'express'
import reviewService from '../services/review.service'
import ApiResponse from '../utils/api-response'

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reviewService.createReview(req.body, req)
    return res.status(201).json(ApiResponse.success(result, 'Review product is successful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Review product is error', 500, error.message))
  }
}

export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reviewService.getAllReviews(req)
    return res.status(201).json(ApiResponse.success(result, '', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('get reviews product is error', 500, error.message))
  }
}

export const reportReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reviewService.reportReview(req.body, req)
    return res.status(201).json(ApiResponse.success(result, 'report review is succeessful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('report review is error', 500, error.message))
  }
}

export const getReportReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reviewService.getReportReview()
    return res.status(200).json(ApiResponse.success(result, '', 200))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('get report review is error', 500, error.message))
  }
}

export const resolveReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reviewService.resolveReport(req.body)
    return res.status(201).json(ApiResponse.success(result, 'report review is succeessful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('report review is error', 500, error.message))
  }
}
