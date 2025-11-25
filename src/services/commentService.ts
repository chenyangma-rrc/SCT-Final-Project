import {
  QuerySnapshot,
  DocumentData,
} from 'firebase-admin/firestore';
import * as commentRepository from '../repositories/commentRepository';
import type { Comment, CreateCommentDto } from '../types/comment';

/**
 * Retrieves comments with optional filtering by postId
 * @param postId - Filter by post ID (optional)
 * @returns Promise containing array of all comments
 */
export const getAllComments = async (postId?: string): Promise<Comment[]> => {
  try {
    const snapshot: QuerySnapshot = await commentRepository.getAllComments(postId);
    const comments: Comment[] = snapshot.docs.map((doc) => {
      const data: DocumentData = doc.data();
      return {
        id: doc.id,
        content: data.content,
        postId: data.postId,
        userId: data.userId,
        createdAt: data.createdAt?.toDate(),
      } as Comment;
    });
    return comments;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Retrieves a single comment by ID
 * @param id - The comment ID
 * @returns Promise containing the comment or null
 */
export const getCommentById = async (id: string): Promise<Comment | null> => {
  try {
    const doc = await commentRepository.getCommentById(id);
    if (!doc.exists) {
      return null;
    }
    const data: DocumentData = doc.data()!;
    return {
      id: doc.id,
      content: data.content,
      postId: data.postId,
      userId: data.userId,
      createdAt: data.createdAt?.toDate(),
    } as Comment;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Creates a new comment
 * @param commentData - The comment data to create
 * @returns Promise containing the created comment
 */
export const createComment = async (commentData: CreateCommentDto): Promise<Comment> => {
  try {
    const commentId: string = await commentRepository.createComment(commentData);
    const dateNow = new Date();
    return {
      id: commentId,
      ...commentData,
      createdAt: dateNow,
    };
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Deletes a comment by ID
 * @param id - The comment ID
 * @returns Promise containing success status
 */
export const deleteComment = async (id: string): Promise<boolean> => {
  try {
    await commentRepository.deleteComment(id);
    return true;
  } catch (error: unknown) {
    throw error;
  }
};