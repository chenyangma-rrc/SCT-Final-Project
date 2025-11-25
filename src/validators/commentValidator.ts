import Joi from 'joi';

/**
 * Validation schema for creating a comment
 */
export const createCommentSchema = Joi.object({
  content: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.empty': 'Content is required',
      'string.min': 'Content must be at least 5 characters',
      'string.max': 'Content must not exceed 500 characters',
    }),
  postId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Post ID is required',
    }),
  userId: Joi.string()
    .required()
    .messages({
      'string.empty': 'User ID is required',
    }),
});