import AppError from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';

export const expressErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction,
): Response => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ name: err.name || 'error', message: err.message });
  }

  console.error(err);

  return res.status(500).json({
    name: err.name || 'error',
    message: err.message || 'Internal server error',
  });
};
