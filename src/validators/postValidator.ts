import Joi from 'joi';

/**
 * Validation schema for creating a post
 */
export const createPostSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title must not exceed 100 characters',
    }),
  content: Joi.string()
    .min(20)
    .max(5000)
    .required()
    .messages({
      'string.empty': 'Content is required',
      'string.min': 'Content must be at least 20 characters',
      'string.max': 'Content must not exceed 5000 characters',
    }),
  authorId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Author ID is required',
    }),
  categoryId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Category ID is required',
    }),
});

/**
 * Validation schema for updating a post
 */
export const updatePostSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title must not exceed 100 characters',
    }),
  content: Joi.string()
    .min(20)
    .max(5000)
    .optional()
    .messages({
      'string.min': 'Content must be at least 20 characters',
      'string.max': 'Content must not exceed 5000 characters',
    }),
  categoryId: Joi.string()
    .optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});