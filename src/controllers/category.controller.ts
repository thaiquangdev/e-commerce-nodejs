import { NextFunction, Request, Response } from 'express'
import categoryService from '../services/category.service'

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.createCategory(req.body)
    return res.status(201).json({
      status: 'success',
      message: 'Tạo mới danh mục thành công',
      result
    })
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Tạo mới danh mục thất bại',
      error
    })
  }
}
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.getAllCategories()
    return res.status(200).json({
      status: 'success',
      result
    })
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi',
      error
    })
  }
}
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.updatedCategory(req.body, req)
    return res.status(200).json({
      status: 'success',
      message: 'Cập nhật danh mục thành công',
      result
    })
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Cập nhật danh mục thất bại',
      error
    })
  }
}
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.deleteCategory(req)
    return res.status(200).json({
      status: 'success',
      message: 'Xóa danh mục thành công',
      result
    })
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Xóa danh mục thất bại',
      error
    })
  }
}
