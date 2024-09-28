import ProductSpuModel from '../models/productSpu.model'
import ReviewModel from '../models/review.model'

class ReviewService {
  async createReview(payload: { star: number; comment: string }, req: any) {
    const { comment, star } = payload
    const { id } = req.user
    const { pid } = req.params

    // kiểm tra xem review này đã tồn tại chưa
    const alreadyReview = await ReviewModel.findOne({ user: id, product: pid })

    if (alreadyReview) {
      alreadyReview.comment = comment
      alreadyReview.star = star
      await alreadyReview.save()
      await this.updateProductRating(pid)
      return {
        review: alreadyReview
      }
    } else {
      const newReview = new ReviewModel({
        user: id,
        product: pid,
        comment,
        star
      })
      await newReview.save()

      const product = await ProductSpuModel.findById(pid)
      if (product) {
        product.reviews = product.reviews + 1
        await product.save()
      }

      await this.updateProductRating(pid)

      return {
        review: newReview
      }
    }
  }

  async updateProductRating(productId: string) {
    const reviews = await ReviewModel.find({ product: productId })
    const totalStars = reviews.reduce((sum, review) => sum + review.star, 0)
    const averageRating = totalStars / reviews.length
    await ProductSpuModel.findByIdAndUpdate(productId, {
      totalReviews: averageRating
    })
  }

  async getAllReviews(req: any) {
    const { id } = req.user
    const { pid } = req.params
    const reviews = await ReviewModel.find({ user: id, product: pid })
    return reviews
  }
}

const reviewService = new ReviewService()

export default reviewService
