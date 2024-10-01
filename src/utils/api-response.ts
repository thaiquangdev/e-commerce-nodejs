class ApiResponse<T> {
  status: number
  success: boolean
  message: string
  data?: T
  error?: string

  constructor(status: number, success: boolean, message: string, data?: T, error?: string) {
    this.status = status
    this.success = success
    this.message = message
    this.data = data
    this.error = error
  }

  static success<T>(data: T, message: string, status: number) {
    return new ApiResponse(status, true, message, data)
  }

  static error<T>(message: string, status: number, error: string) {
    return new ApiResponse(status, false, message, undefined, error)
  }
}

export default ApiResponse
