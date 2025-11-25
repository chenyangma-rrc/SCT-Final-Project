import {
  QuerySnapshot,
  DocumentData,
} from 'firebase-admin/firestore';
import * as categoryRepository from '../repositories/categoryRepository';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category';

/**
 * Retrieves all categories from the repository
 * @returns Promise containing array of all categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const snapshot: QuerySnapshot = await categoryRepository.getAllCategories();
    const categories: Category[] = snapshot.docs.map((doc) => {
      const data: DocumentData = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Category;
    });
    return categories;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Retrieves a single category by ID
 * @param id - The category ID
 * @returns Promise containing the category or null
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const doc = await categoryRepository.getCategoryById(id);
    if (!doc.exists) {
      return null;
    }
    const data: DocumentData = doc.data()!;
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Category;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Creates a new category
 * @param categoryData - The category data to create
 * @returns Promise containing the created category
 */
export const createCategory = async (categoryData: CreateCategoryDto): Promise<Category> => {
  try {
    const categoryId: string = await categoryRepository.createCategory(categoryData);
    const dateNow = new Date();
    return {
      id: categoryId,
      ...categoryData,
      createdAt: dateNow,
      updatedAt: dateNow,
    };
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Updates an existing category
 * @param id - The category ID
 * @param categoryData - The updated category data
 * @returns Promise containing the updated category
 */
export const updateCategory = async (id: string, categoryData: UpdateCategoryDto): Promise<Category> => {
  try {
    await categoryRepository.updateCategory(id, categoryData);
    const updatedCategory = await getCategoryById(id);
    if (!updatedCategory) {
      throw new Error('Category not found after update');
    }
    return updatedCategory;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Deletes a category by ID
 * @param id - The category ID
 * @returns Promise containing success status
 */
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    await categoryRepository.deleteCategory(id);
    return true;
  } catch (error: unknown) {
    throw error;
  }
};