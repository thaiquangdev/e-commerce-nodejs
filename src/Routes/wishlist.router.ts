import express from 'express'
import { authentication, authorization } from '../middlewares/auth.middlewares'
import { createWishlist, getAllWishlists } from '../controllers/wishlist.controller'

const router = express.Router()

router.post('/:pid', authentication, authorization, createWishlist)
router.get('/:pid', authentication, authorization, getAllWishlists)

export default router
