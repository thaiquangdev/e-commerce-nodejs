import WishlistModel from '../models/wishlist.model'

class WishlistService {
  async createWishlist(req: any) {
    const { pid } = req.params
    const { id } = req.user
    const alreadyWishlist = await WishlistModel.findOne({ user: id, product: pid })
    if (alreadyWishlist) {
      await WishlistModel.deleteOne({ _id: alreadyWishlist._id })
      return {
        message: 'Sản phẩm đã được xóa khỏi wishlist',
        success: true
      }
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

  async getAllWishlist(req: any) {
    const { pid } = req.params
    const { id } = req.user
    const wishlists = await WishlistModel.find({ user: id, product: pid })
    return wishlists
  }
}

const wishlistService = new WishlistService()
export default wishlistService
