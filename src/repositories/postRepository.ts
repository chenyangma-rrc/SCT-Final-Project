import {
  QuerySnapshot,
  DocumentSnapshot,
  Query,
} from 'firebase-admin/firestore';
import { db } from '../../config/firebase';
import { CreatePostDto, UpdatePostDto } from '../types/post';

const COLLECTION: string = 'posts';

/**
 * Retrieves posts with optional pagination and filtering
 * @param page - Page number
 * @param limit - Items per page
 * @param categoryId - Filter by category ID
 * @returns Promise containing QuerySnapshot of posts
 */
export const getAllPosts = async (
  page?: number,
  limit?: number,
  categoryId?: string
): Promise<QuerySnapshot> => {
  try {
    let query: Query = db.collection(COLLECTION);

    if (categoryId) {
      query = query.where('categoryId', '==', categoryId);
    }

    if (page && limit) {
      const offset = (page - 1) * limit;
      query = query.limit(limit).offset(offset);
    }

    const snapshot: QuerySnapshot = await query.get();
    return snapshot;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Retrieves a post by ID from Firestore
 * @param id - The post ID
 * @returns Promise containing DocumentSnapshot
 */
export const getPostById = async (id: string): Promise<DocumentSnapshot> => {
  try {
    const doc: DocumentSnapshot = await db.collection(COLLECTION).doc(id).get();
    return doc;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Creates a new post in Firestore
 * @param postData - The post data
 * @returns Promise containing the created post ID
 */
export const createPost = async (postData: CreatePostDto): Promise<string> => {
  try {
    const newPost = {
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docRef = await db.collection(COLLECTION).add(newPost);
    return docRef.id;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Updates a post in Firestore
 * @param id - The post ID
 * @param postData - The updated data
 * @returns Promise<void>
 */
export const updatePost = async (id: string, postData: UpdatePostDto): Promise<void> => {
  try {
    const updatedData = {
      ...postData,
      updatedAt: new Date(),
    };
    await db.collection(COLLECTION).doc(id).update(updatedData);
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Deletes a post from Firestore
 * @param id - The post ID
 * @returns Promise<void>
 */
export const deletePost = async (id: string): Promise<void> => {
  try {
    await db.collection(COLLECTION).doc(id).delete();
  } catch (error: unknown) {
    throw error;
  }
};