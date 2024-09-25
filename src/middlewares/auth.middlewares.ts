import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import UserModel from '../models/user.model'
import { UserRole } from '../utils/user-enum'

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Loại bỏ chuỗi "Bearer " khỏi token
      const token = authHeader.split(' ')[1]

      // Xác thực token và lấy thông tin giải mã
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload

      // Tìm người dùng bằng ID từ token
      const user = await UserModel.findById(decoded.id)

      if (!user) {
        return res.status(401).json({ message: 'Người dùng không tồn tại' })
      }

      // Gắn thông tin người dùng vào request
      req.user = user
      return next()
    } else {
      return res.status(401).json({ message: 'Token không hợp lệ hoặc không tồn tại' })
    }
  } catch (error: any) {
    return res.status(401).json({ message: 'Xác thực không thành công', error: error.message })
  }
}

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kiểm tra nếu người dùng chưa được xác thực
    if (!req.user) {
      return res.status(401).json({ message: 'Người dùng chưa được xác thực' })
    }

    // Kiểm tra vai trò của người dùng, giả định `role` có giá trị 'admin'
    if (req.user.roles !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Không có quyền truy cập' })
    }

    // Nếu là admin, tiếp tục thực hiện các hành động tiếp theo
    next()
  } catch (error: any) {
    return res.status(403).json({ message: 'Không có quyền truy cập', error: error.message })
  }
}
