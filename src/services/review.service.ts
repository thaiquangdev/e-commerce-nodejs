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

      return {
        message: 'Đánh giá của bạn đã được cập nhật',
        success: true,
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

      return {
        message: 'Đánh giá của bạn đã được thêm',
        success: true,
        review: newReview
      }
    }
  }

  async getAllReviews() {}
}

const reviewService = new ReviewService()

export default reviewService
