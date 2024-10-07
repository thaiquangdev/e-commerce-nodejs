import express from 'express'
import { loginValidator, registerValidator } from '../middlewares/user.middlewares'
import {
  changePasswordController,
  editProfileController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController
} from '../controllers/user.controller'
import { validate } from '../utils/validation'
import { authentication } from '../middlewares/auth.middlewares'

const router = express.Router()

router.post('/login', loginValidator, loginController)

router.post('/register', validate(registerValidator), registerController)

router.post('/logout', authentication, logoutController)

router.put('/edit-profile', authentication, editProfileController)

router.put('/change-password', authentication, changePasswordController)

router.put('/forgot-password', forgotPasswordController)

router.put('reset-password', resetPasswordController)

export default router
