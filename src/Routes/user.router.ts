import express from 'express'
import {
  addnewAddressController,
  changePasswordController,
  editProfileController,
  forgotPasswordController,
  loginAdminController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  resetToken
} from '../controllers/user.controller'
import { authentication } from '../middlewares/auth.middlewares'

const router = express.Router()

router.post('/login', loginController)

router.post('/login-admin', loginAdminController)

router.post('/register', registerController)

router.post('/logout', authentication, logoutController)

router.post('/reset-token', resetToken)

router.put('/edit-profile', authentication, editProfileController)

router.put('/change-password', authentication, changePasswordController)

router.put('/forgot-password', forgotPasswordController)

router.put('/reset-password', resetPasswordController)

router.post('/add-new-address', authentication, addnewAddressController)

export default router
