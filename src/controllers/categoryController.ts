import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/categoryService';

/**
 * Retrieves all categories from the database
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ 
      success: true,
      data: categories
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Retrieves a single category by ID
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    
    if (!category) {
      res.status(404).json({ 
        success: false,
        message: 'Category not found'
      });
      return;
    }
    
    res.status(200).json({ 
      success: true,
      data: category
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Creates a new category
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categoryData = req.body;
    const newCategory = await categoryService.createCategory(categoryData);
    res.status(201).json({ 
      success: true,
      data: newCategory
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Updates an existing category
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    const updatedCategory = await categoryService.updateCategory(id, categoryData);
    res.status(200).json({ 
      success: true,
      data: updatedCategory
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Deletes a category by ID
 * @param req - The express Request object
 * @param res - The express Response object
 * @param next - The express middleware chaining function
 */
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    res.status(200).json({ 
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error: unknown) {
    next(error);
  }
};