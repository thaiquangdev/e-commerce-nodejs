class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}

class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(message, 400)
  }
}

class NotFoundError extends AppError {
  constructor(message: string = 'Not Found') {
    super(message, 404)
  }
}

class InternalServerError extends AppError {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500)
  }
}

export { AppError, BadRequestError, NotFoundError, InternalServerError }
