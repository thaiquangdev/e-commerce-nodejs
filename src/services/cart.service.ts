import CartModel from '../models/cart'
import ProductSkuModel from '../models/productSku.model'
import { AppError } from '../utils/app-error'

class CartService {
  async addToCart(
    payload: {
      pid: string
      sku: string
      quantity: number
      storage?: string
      color?: string
      price: number
      totalPrice: number
    },
    req: any
  ) {
    const { pid, sku, quantity, storage, color, price, totalPrice } = payload
    const { id } = req.user

    const product = await ProductSkuModel.findOne({ sku })

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    if (product.stock < quantity) {
      throw new AppError('Not enough stock available', 400)
    }

    const alreadyCart = await CartModel.findOne({ user: id, product: pid })

    product.stock -= quantity
    await product.save()

    if (!alreadyCart) {
      const cart = new CartModel({
        user: id,
        product: pid,
        quantity: quantity,
        storage: storage || null,
        color: color || null,
        price: price,
        totalPrice: totalPrice
      })
      await cart.save()
      return cart
    } else {
      alreadyCart.quantity += quantity
      alreadyCart.totalPrice += totalPrice
      await alreadyCart.save()
      return alreadyCart
    }
  }

  async getAllCarts(req: any) {
    const { id } = req.user

    try {
      const carts = await CartModel.find({ user: id, status: 'pending' })
      return carts // Hoặc có thể định dạng lại dữ liệu nếu cần
    } catch (error) {
      throw new AppError('Could not retrieve carts', 500) // Thông báo lỗi nếu không lấy được giỏ hàng
    }
  }

  async updateQuantity(req: any, payload: { items: Array<{ pid: string; sku: string; quantity: number }> }) {
    const { id } = req.user
    const { items } = payload
    try {
      for (const item of items) {
        const { pid, sku, quantity } = item
        const cartItem = await CartModel.findOne({ user: id, product: pid })
        if (cartItem) {
          const product = await ProductSkuModel.findOne({ sku })
          if (!product) {
            throw new AppError(`Product with ID ${sku} not found`, 404)
          }

          if (product.stock < quantity) {
            throw new AppError(`Not enough stock available for product ${sku}`, 400)
          }

          cartItem.quantity = quantity
          cartItem.totalPrice = quantity * cartItem.price
          await cartItem.save()

          product.stock -= quantity
          await product.save()
        } else {
          throw new AppError(`Cart item with product ID ${pid} not found`, 404)
        }
      }
      return { message: 'Cart updated successfully' }
    } catch (error) {
      throw new AppError('Could not update cart', 500)
    }
  }

  async deleteCart(req: any, payload: { pid: string }) {
    const { pid } = payload
    const { id } = req.user

    try {
      const cart = await CartModel.findOne({ user: id, product: pid })

      if (!cart) {
        throw new AppError('Cart item not found', 404)
      }

      await cart.deleteOne()

      return { message: 'Cart deleted successfully' }
    } catch (error) {
      throw new AppError('Could not delete cart item', 500)
    }
  }
}

const cartService = new CartService()
export default cartService
