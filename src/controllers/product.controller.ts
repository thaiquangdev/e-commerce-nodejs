import { NextFunction, Request, Response } from 'express'
import productService from '../services/product.service'

export const createProductSpu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.createProductSpu(req.body, req)
    return res.status(201).json({
      status: 'success',
      message: 'Tạo mới danh mục thành công',
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
