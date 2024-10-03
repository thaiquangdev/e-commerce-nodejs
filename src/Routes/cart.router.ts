import express from 'express'
import { addToCart, deleteCart, getAllCarts, updateQuantityCart } from '../controllers/cart.controller'
import { authentication, authorization } from '../middlewares/auth.middlewares'

const router = express.Router()

router.post('/', authentication, authorization, addToCart)
router.get('/', authentication, authorization, getAllCarts)
router.put('/update-quantity', authentication, authorization, updateQuantityCart)
router.delete('/delete-cart', authentication, authorization, deleteCart)

export default router
