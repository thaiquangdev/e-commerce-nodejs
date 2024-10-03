import WishlistModel from '../models/wishlist.model'

class WishlistService {
  async createWishlist(req: any) {
    const { pid } = req.params
    const { id } = req.user
    const alreadyWishlist = await WishlistModel.findOne({ user: id, product: pid })
    if (alreadyWishlist) {
      return this.deleteWishlist(req) // Gọi hàm xóa nếu sản phẩm đã có trong wishlist
    } else {
      const newWishlist = new WishlistModel({
        user: id,
        product: pid
      })
      await newWishlist.save()
      return {
        review: newWishlist
      }
    }
  }

  async deleteWishlist(req: any) {
    const { wid } = req.params

    const wishlistItem = await WishlistModel.findByIdAndDelete(wid)

    if (!wishlistItem) {
      return {
        message: 'Sản phẩm không có trong wishlist',
        success: false
      }
    }

    return {
      message: 'Sản phẩm đã được xóa khỏi wishlist',
      success: true,
      data: wishlistItem
    }
  }

  async getAllWishlist(req: any) {
    const { id } = req.user
    const wishlists = await WishlistModel.find({ user: id }).populate('product')
    return wishlists
  }
}

const wishlistService = new WishlistService()
export default wishlistService
