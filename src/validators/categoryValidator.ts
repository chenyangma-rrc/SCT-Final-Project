import Joi from 'joi';

/**
 * Validation schema for creating a category
 */
export const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name must not exceed 50 characters',
    }),
  description: Joi.string()
    .min(10)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description must not exceed 200 characters',
    }),
});

/**
 * Validation schema for updating a category
 */
export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name must not exceed 50 characters',
    }),
  description: Joi.string()
    .min(10)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description must not exceed 200 characters',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});