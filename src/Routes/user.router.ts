import express from 'express'
import { loginValidator, registerValidator } from '../middlewares/user.middlewares'
import { loginController, registerController } from '../controllers/user.controller'
import { validate } from '../utils/validation'

const router = express.Router()

router.post('/login', loginValidator, loginController)

router.post('/register', validate(registerValidator), registerController)

export default router
