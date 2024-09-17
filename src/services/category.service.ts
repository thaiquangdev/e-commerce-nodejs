import CategoryModel from '../models/category.model'
import slugify from 'slugify'

class CategoryService {
  async createCategory(payload: { title: string }) {
    const { title } = payload
    if (await this.findOneTitle(title)) {
      throw new Error('Danh mục này đã có.')
    }

    const category = new CategoryModel({
      title,
      slug: slugify(title, { lower: true, strict: true })
    })
    await category.save()
    return category
  }

  async updatedCategory(payload: { title?: string }, req: any) {
    const { title } = payload
    const { id } = req.params

    const category = await this.findOneId(id)
    if (!category) {
      throw new Error('Danh mục không có trong db')
    }

    if (title) {
      category.title = title
      category.slug = slugify(title, { lower: true, strict: true })
    }

    await category.save()

    return category
  }

  async deleteCategory(req: any) {
    const { id } = req.params

    const category = await this.findOneId(id)
    if (!category) {
      throw new Error('Danh mục không có trong db')
    }

    await CategoryModel.deleteOne({ _id: id })
    return category
  }

  async getAllCategories() {
    return await CategoryModel.find()
  }

  async findOneTitle(title: string) {
    return await CategoryModel.findOne({ title })
  }

  async findOneId(id: string) {
    return await CategoryModel.findById(id)
  }
}

const categoryService = new CategoryService()
export default categoryService
