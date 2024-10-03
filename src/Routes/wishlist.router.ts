import express from 'express'
import { authentication, authorization } from '../middlewares/auth.middlewares'
import { createWishlist, deleteWishlist, getAllWishlists } from '../controllers/wishlist.controller'

const router = express.Router()

router.post('/:pid', authentication, authorization, createWishlist)
router.get('/', authentication, authorization, getAllWishlists)
router.delete('/:wid', authentication, authorization, deleteWishlist)

export default router
