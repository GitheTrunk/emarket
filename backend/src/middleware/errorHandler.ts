import { Request, Response, NextFunction } from 'express'

interface AppError extends Error {
  status?: number
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err)

  const status = err.status || 500
  const message = err.message || 'Internal server error'

  res.status(status).json({
    error: message,
    status
  })
}

/**
 * 404 Not Found middleware
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  })
}
