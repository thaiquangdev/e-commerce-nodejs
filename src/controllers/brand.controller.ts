import { NextFunction, Request, Response } from 'express'
import brandService from '../services/brand.service'
import ApiResponse from '../utils/api-response'

export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await brandService.createBrand(req.body, req)
    return res.status(201).json(ApiResponse.success(result, 'Create brand is successful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Create brand is failed', 500, error.message))
  }
}
export const updateBrand = (req: Request, res: Response, next: NextFunction) => {}
export const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await brandService.deleteBrand(req)
    return res.status(200).json(ApiResponse.success(undefined, 'Delete brand is successful', 200))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Dreate brand is failed', 500, error.message))
  }
}
export const getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await brandService.getAllBrands()
    return res.status(200).json(ApiResponse.success(result, '', 200))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Get all brands is failed', 500, error.message))
  }
}
