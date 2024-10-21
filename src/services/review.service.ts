import ProductSpuModel from '../models/productSpu.model'
import ReportModel from '../models/report.model'
import ReviewModel from '../models/review.model'
import { AppError } from '../utils/app-error'

class ReviewService {
  async createReview(payload: { rating: number; comment: string }, req: any) {
    const { comment, rating } = payload
    const { id } = req.user
    const { pid } = req.params

    console.log(payload)

    // kiểm tra xem review này đã tồn tại chưa
    const alreadyReview = await ReviewModel.findOne({ user: id, product: pid })

    if (alreadyReview) {
      alreadyReview.comment = comment
      alreadyReview.star = rating
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
        star: rating
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

    const averageRating = reviews.length > 0 ? totalStars / reviews.length : 0

    await ProductSpuModel.findByIdAndUpdate(
      productId,
      {
        totalReviews: averageRating
      },
      { new: true }
    )
  }

  async getAllReviews(req: any) {
    const { pid } = req.params
    const reviews = await ReviewModel.find({ product: pid, isBanned: false })
      .populate('user', 'fullName')
      .sort({ createdAt: -1 })
    return reviews
  }

  async reportReview(payload: { content: string; reviewId: string }, req: any) {
    const { content, reviewId } = payload
    const { id } = req.user

    const review = await ReviewModel.findById(reviewId)
    if (!review) {
      throw new AppError('Review is not found', 404)
    }

    // Tạo báo cáo
    const report = await ReviewModel.create({
      review: reviewId,
      user: id,
      content
    })

    return report
  }

  async getReportReview() {
    const reports = await ReviewModel.find({ isResolved: false }).populate('review').populate('user')

    return reports
  }

  async resolveReport(payload: { reportId: string; action: string }) {
    const { reportId, action } = payload
    const report = await ReportModel.findById(reportId)
    if (!report) {
      throw new AppError('Report is not found', 404)
    }

    if (action === 'approve') {
      await ReviewModel.findByIdAndUpdate(report.review, { isBanned: true })
    }

    report.isResolved = true
    await report.save()
  }
}

const reviewService = new ReviewService()

export default reviewService
