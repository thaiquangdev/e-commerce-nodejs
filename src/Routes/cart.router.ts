import express from 'express'
import { addToCart, deleteCart, getAllCarts, updateQuantityCart } from '../controllers/cart.controller'
import { authentication } from '../middlewares/auth.middlewares'

const router = express.Router()

router.post('/', authentication, addToCart)
router.get('/', authentication, getAllCarts)
router.put('/update-quantity', authentication, updateQuantityCart)
router.delete('/delete-cart', authentication, deleteCart)

export default router
