import { NextFunction, Request, Response } from 'express'
import brandService from '../services/brand.service'

export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await brandService.createBrand(req.body, req)
    return res.status(201).json({
      status: 'success',
      message: 'Tạo mới hãng thành công',
      result
    })
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Tạo mới hãng thất bại',
      error
    })
  }
}
export const updateBrand = (req: Request, res: Response, next: NextFunction) => {}
export const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await brandService.deleteBrand(req)
    return res.status(201).json({
      status: 'success',
      message: 'Xóa hãng thành công'
    })
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Xóa hãng thất bại',
      error
    })
  }
}
export const getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await brandService.getAllBrands()
    return res.status(201).json({
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
