import { NextFunction, Request, Response } from 'express'
import productService from '../services/product.service'

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.createProduct(req.body)
    return res.status(201).json({
      status: 'success',
      message: 'Tạo mới Sản phẩm thành công',
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

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.getAllProducts(req)
    return res.status(201).json({
      status: 'success',
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

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.getProduct(req)
    return res.status(201).json({
      status: 'success',
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

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.deleteProduct(req)
    return res.status(201).json({
      status: 'success',
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

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.updateProductSpu(req)
    return res.status(201).json({
      status: 'success',
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
