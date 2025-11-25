import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/commentService';

/**
 * Retrieves all comments from the database with optional filtering
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const getAllComments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postId = req.query.postId as string | undefined;
    
    const comments = await commentService.getAllComments(postId);
    res.status(200).json({ 
      success: true,
      data: comments
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Retrieves a single comment by ID
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const getCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const comment = await commentService.getCommentById(id);
    
    if (!comment) {
      res.status(404).json({ 
        success: false,
        message: 'Comment not found'
      });
      return;
    }
    
    res.status(200).json({ 
      success: true,
      data: comment
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Creates a new comment
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commentData = req.body;
    const newComment = await commentService.createComment(commentData);
    res.status(201).json({ 
      success: true,
      data: newComment
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Deletes a comment by ID
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await commentService.deleteComment(id);
    res.status(200).json({ 
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error: unknown) {
    next(error);
  }
};