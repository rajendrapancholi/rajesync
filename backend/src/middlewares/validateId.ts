import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

/**
 * Middleware to validate MongoDB ObjectId in request parameters.
 * Prevents unwanted strings or malicious input from hitting the database.
 */
export const validateId = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const rawId = req.params[paramName];
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        status: "error",
        message: `Invalid ID format!`
      });
    }

    next();
  };
};
