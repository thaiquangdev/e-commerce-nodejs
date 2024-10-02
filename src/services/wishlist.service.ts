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
    const { id } = req.user // Lấy user ID từ req.user
    const { pid } = req.params // Lấy product ID từ params

    const wishlistItem = await WishlistModel.findOne({ user: id, product: pid })
    if (!wishlistItem) {
      return {
        message: 'Sản phẩm không có trong wishlist',
        success: false
      }
    }

    await WishlistModel.deleteOne({ _id: wishlistItem._id })
    return {
      message: 'Sản phẩm đã được xóa khỏi wishlist',
      success: true
    }
  }

  async getAllWishlist(req: any) {
    const { pid } = req.params
    const { id } = req.user
    const wishlists = await WishlistModel.find({ user: id, product: pid })
    return wishlists
  }
}

const wishlistService = new WishlistService()
export default wishlistService
