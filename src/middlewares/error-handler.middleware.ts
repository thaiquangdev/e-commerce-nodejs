import { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils/app-error'
import ApiResponse from '../utils/api-response'

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const isOperational = err.isOperational || false

  if (!isOperational) {
    console.error('An unexpected error occurred:', err)
  }

  return res
    .status(statusCode)
    .json(ApiResponse.error(err.message, statusCode, isOperational ? '' : 'Internal Server Error'))
}

export default errorHandler
