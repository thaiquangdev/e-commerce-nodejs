import { NextFunction, Request, Response } from 'express'
import productService from '../services/product.service'
import ApiResponse from '../utils/api-response'

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.createProduct(req.body, req)
    return res.status(201).json(ApiResponse.success(result, 'Create product is successful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Create product is failed', 500, error.message))
  }
}

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.getAllProducts(req)
    return res.status(200).json(ApiResponse.success(result, '', 200))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Get products is failed', 500, error.message))
  }
}

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.getProduct(req)
    return res.status(200).json(ApiResponse.success(result, '', 200))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Get product is failed', 500, error.message))
  }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.deleteProduct(req)
    return res.status(200).json(ApiResponse.success(undefined, 'Delete product is successful', 200))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Delete product is failed', 500, error.message))
  }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.updateProductSpu(req)
    return res.status(201).json(ApiResponse.success(undefined, 'Update product is successful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Update product is failed', 500, error.message))
  }
}
