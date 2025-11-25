import {
  QuerySnapshot,
  DocumentSnapshot,
  Query,
} from 'firebase-admin/firestore';
import { db } from '../../config/firebase';
import { CreateCommentDto } from '../types/comment';

const COLLECTION: string = 'comments';

/**
 * Retrieves comments with optional filtering by postId
 * @param postId - Filter by post ID
 * @returns Promise containing QuerySnapshot of comments
 */
export const getAllComments = async (postId?: string): Promise<QuerySnapshot> => {
  try {
    let query: Query = db.collection(COLLECTION);

    if (postId) {
      query = query.where('postId', '==', postId);
    }

    const snapshot: QuerySnapshot = await query.get();
    return snapshot;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Retrieves a comment by ID from Firestore
 * @param id - The comment ID
 * @returns Promise containing DocumentSnapshot
 */
export const getCommentById = async (id: string): Promise<DocumentSnapshot> => {
  try {
    const doc: DocumentSnapshot = await db.collection(COLLECTION).doc(id).get();
    return doc;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Creates a new comment in Firestore
 * @param commentData - The comment data
 * @returns Promise containing the created comment ID
 */
export const createComment = async (commentData: CreateCommentDto): Promise<string> => {
  try {
    const newComment = {
      ...commentData,
      createdAt: new Date(),
    };
    const docRef = await db.collection(COLLECTION).add(newComment);
    return docRef.id;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Deletes a comment from Firestore
 * @param id - The comment ID
 * @returns Promise<void>
 */
export const deleteComment = async (id: string): Promise<void> => {
  try {
    await db.collection(COLLECTION).doc(id).delete();
  } catch (error: unknown) {
    throw error;
  }
};