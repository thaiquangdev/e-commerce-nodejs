import { NextFunction, Request, Response } from 'express'
import userService from '../services/user.service'
import ApiResponse from '../utils/api-response'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.login(req.body, res)
    return res.status(201).json(ApiResponse.success(result, 'Login is successful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Login is failed', 500, error.message))
  }
}

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.register(req.body)
    return res.status(201).json(ApiResponse.success(result, 'Register is successful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Register is failed', 500, error.message))
  }
}

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.logout(req, res)
    return res.status(200).json(ApiResponse.success(undefined, 'Logout is successful', 200))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Logout is failed', 500, error.message))
  }
}

export const editProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.editProfile(req.body, req)
    return res.status(201).json(ApiResponse.success(result, 'Edit profile is successful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Edit profile is failed', 500, error.message))
  }
}

export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.changePassword(req.body, req)
    return res.status(201).json(ApiResponse.success(undefined, 'Change password is successful', 201))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Change password is failed', 500, error.message))
  }
}

export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.forgotPassword(req.body)
    return res.status(200).json(ApiResponse.success(undefined, 'Please check your email', 200))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Forgot password is failed', 500, error.message))
  }
}

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.resetPassword(req.body)
    return res.status(200).json(ApiResponse.success(undefined, 'Reset password is successful', 200))
  } catch (error: any) {
    return res.status(500).json(ApiResponse.error('Reset password is failed', 500, error.message))
  }
}
