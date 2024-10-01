import cloudinaryConfig from '../configs/cloudinary.config'
import BrandModel from '../models/brand.model'
import { AppError } from '../utils/app-error'

class BrandService {
  async createBrand(payload: { title: string }, req: any) {
    const { title } = payload
    if (await this.findOneBrand(title)) {
      throw new AppError('Brand is exist', 400)
    }
    const imageUrl = req.body.cloudinaryUrls
    if (!imageUrl || imageUrl.length === 0) {
      throw new AppError('Image is not found', 404)
    }
    const brand = new BrandModel({
      title
    })
    await brand.save()
    return brand
  }
  async updateBrand(payload: { title?: string; thumb?: string }, req: any) {}
  async deleteBrand(req: any) {
    const { id } = req.params
    const brand = await this.findOneId(id)
    if (!brand) {
      throw new AppError('Brand is not found', 404)
    }
    await BrandModel.deleteOne({ _id: id })
    return brand
  }

  async getAllBrands() {
    return await BrandModel.find()
  }

  async findOneBrand(title: string) {
    return await BrandModel.findOne({ title })
  }

  async findOneId(id: string) {
    return await BrandModel.findById(id)
  }
}

const brandService = new BrandService()
export default brandService
