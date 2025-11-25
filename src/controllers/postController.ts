import { Request, Response, NextFunction } from 'express';
import * as postService from '../services/postService';

/**
 * Retrieves all posts from the database
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const categoryId = req.query.categoryId as string | undefined;

    const posts = await postService.getAllPosts(page, limit, categoryId);
    res.status(200).json({ 
      success: true,
      data: posts,
      pagination: page && limit ? { page, limit, total: posts.length } : undefined
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Retrieves a single post by ID
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await postService.getPostById(id);
    
    if (!post) {
      res.status(404).json({ 
        success: false,
        message: 'Post not found'
      });
      return;
    }
    
    res.status(200).json({ 
      success: true,
      data: post
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Creates a new post
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postData = req.body;
    const newPost = await postService.createPost(postData);
    res.status(201).json({ 
      success: true,
      data: newPost
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Updates an existing post
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const postData = req.body;
    const updatedPost = await postService.updatePost(id, postData);
    res.status(200).json({ 
      success: true,
      data: updatedPost
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Deletes a post by ID
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await postService.deletePost(id);
    res.status(200).json({ 
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error: unknown) {
    next(error);
  }
};