import express from 'express'
import { authentication } from '../middlewares/auth.middlewares'
import { createWishlist, deleteWishlist, getAllWishlists } from '../controllers/wishlist.controller'

const router = express.Router()

router.post('/:pid', authentication, createWishlist)
router.get('/', authentication, getAllWishlists)
router.delete('/:wid', authentication, deleteWishlist)

export default router
