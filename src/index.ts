import express from 'express'
import dotenv from 'dotenv'
import connectDB from './configs/db.config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './Routes/user.router'
import categoryRouter from './Routes/category.router'

dotenv.config()

const app = express()
const port = 3000

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
  })
)

connectDB()

app.use('/users', userRouter)
app.use('/categories', categoryRouter)

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})
