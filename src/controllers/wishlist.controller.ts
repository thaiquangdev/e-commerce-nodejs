import { NextFunction, Request, Response } from 'express'
import wishlistService from '../services/wishlist.service'
import ApiResponse from '../utils/api-response'

export const createWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await wishlistService.createWishlist(req)
    return res.status(201).json(ApiResponse.success(result, '', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Add wishlist is error', 500, error.message))
  }
}

export const getAllWishlists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await wishlistService.getAllWishlist(req)
    return res.status(200).json(ApiResponse.success(result, '', 200))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Get wishlists is error', 500, error.message))
  }
}
