import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

/**
 * Middleware to validate request body against a Joi schema
 * @param schema - The Joi schema to validate against
 * @returns Express middleware function
 */
export const validateBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessages,
      });
      return;
    }

    req.body = value;
    next();
  };
};