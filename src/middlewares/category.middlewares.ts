import { NextFunction, Request, Response } from 'express'

export const createCategoryValidator = (req: Request, res: Response, next: NextFunction) => {
  const { title } = req.body
  if (!title) {
    return res.status(400).json({
      error: 'Chưa nhập tên danh mục'
    })
  }
  next()
}
