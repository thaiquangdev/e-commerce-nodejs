import { NextFunction, Request, Response } from 'express'
import cartService from '../services/cart.service'
import ApiResponse from '../utils/api-response'

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cartService.addToCart(req.body, req)
    return res.status(201).json(ApiResponse.success(result, 'Add to cart is successful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Add to cart is failed', 500, error.message))
  }
}

export const getAllCarts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cartService.getAllCarts(req)
    return res.status(200).json(ApiResponse.success(result, '', 200))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Get all carts is failed', 500, error.message))
  }
}

export const updateQuantityCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cartService.updateQuantity(req, req.body)
    return res.status(201).json(ApiResponse.success(result, 'Update to cart is successful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Update to cart is failed', 500, error.message))
  }
}

export const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cartService.deleteCart(req, req.body)
    return res.status(201).json(ApiResponse.success(result, 'Delete to cart is successful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Delete to cart is failed', 500, error.message))
  }
}
