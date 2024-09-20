import { NextFunction, Request, Response } from 'express'
import userService from '../services/user.service'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.login(req.body, res)
    return res.status(201).json({
      status: 'success',
      message: 'Đăng nhập thành công',
      token: result
    })
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Đăng nhập thất bại',
      error
    })
  }
}

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.register(req.body)
    return res.status(201).json({
      status: 'success',
      message: 'Đăng ký thành công',
      result
    })
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Đăng ký thất bại',
      error
    })
  }
}
