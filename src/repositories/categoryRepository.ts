import {
  QuerySnapshot,
  DocumentSnapshot,
} from 'firebase-admin/firestore';
import { db } from '../../config/firebase';
import { CreateCategoryDto, UpdateCategoryDto } from '../types/category';
  
  const COLLECTION: string = 'categories';
  
  /**
   * Retrieves all categories from Firestore
   * @returns Promise containing QuerySnapshot of all categories
   */
  export const getAllCategories = async (): Promise<QuerySnapshot> => {
    try {
      const snapshot: QuerySnapshot = await db.collection(COLLECTION).get();
      return snapshot;
    } catch (error: unknown) {
      throw error;
    }
  };
  
  /**
   * Retrieves a category by ID from Firestore
   * @param id - The category ID
   * @returns Promise containing DocumentSnapshot
   */
  export const getCategoryById = async (id: string): Promise<DocumentSnapshot> => {
    try {
      const doc: DocumentSnapshot = await db.collection(COLLECTION).doc(id).get();
      return doc;
    } catch (error: unknown) {
      throw error;
    }
  };
  
  /**
   * Creates a new category in Firestore
   * @param categoryData - The category data
   * @returns Promise containing the created category ID
   */
  export const createCategory = async (categoryData: CreateCategoryDto): Promise<string> => {
    try {
      const newCategory = {
        ...categoryData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await db.collection(COLLECTION).add(newCategory);
      return docRef.id;
    } catch (error: unknown) {
      throw error;
    }
  };
  
  /**
   * Updates a category in Firestore
   * @param id - The category ID
   * @param categoryData - The updated data
   * @returns Promise<void>
   */
  export const updateCategory = async (id: string, categoryData: UpdateCategoryDto): Promise<void> => {
    try {
      const updatedData = {
        ...categoryData,
        updatedAt: new Date(),
      };
      await db.collection(COLLECTION).doc(id).update(updatedData);
    } catch (error: unknown) {
      throw error;
    }
  };
  
  /**
   * Deletes a category from Firestore
   * @param id - The category ID
   * @returns Promise<void>
   */
  export const deleteCategory = async (id: string): Promise<void> => {
    try {
      await db.collection(COLLECTION).doc(id).delete();
    } catch (error: unknown) {
      throw error;
    }
  };