import { NextFunction, Request, Response } from 'express'
import categoryService from '../services/category.service'
import ApiResponse from '../utils/api-response'

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.createCategory(req.body)
    return res.status(201).json(ApiResponse.success(result, 'Create category is successful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Create category is failed', 500, error.message))
  }
}
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.getAllCategories()
    return res.status(200).json(ApiResponse.success(result, '', 200))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Get categories is failed', 500, error.message))
  }
}
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.updatedCategory(req.body, req)
    return res.status(201).json(ApiResponse.success(result, 'Update category is successful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Update category is failed', 500, error.message))
  }
}
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.deleteCategory(req)
    return res.status(200).json(ApiResponse.success(undefined, 'Delte category is successful', 200))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Delete category is failed', 500, error.message))
  }
}
