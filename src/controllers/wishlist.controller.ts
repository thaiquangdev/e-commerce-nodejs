import { NextFunction, Request, Response } from 'express'
import wishlistService from '../services/wishlist.service'

export const createWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await wishlistService.createWishlist(req)
    return res.status(201).json({
      status: 'success',
      wishlist: result
    })
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Thất bại',
      error
    })
  }
}

export const getAllWishlists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await wishlistService.getAllWishlist(req)
    return res.status(201).json({
      status: 'success',
      wishlists: result
    })
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Thất bại',
      error
    })
  }
}
