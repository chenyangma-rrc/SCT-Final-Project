import {
  QuerySnapshot,
  DocumentData,
} from 'firebase-admin/firestore';
import * as postRepository from '../repositories/postRepository';
import type { Post, CreatePostDto, UpdatePostDto } from '../types/post';

/**
 * Retrieves posts with optional pagination and filtering
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param categoryId - Filter by category ID (optional)
 * @returns Promise containing array of posts
 */
export const getAllPosts = async (
  page: number = 1,
  limit: number = 10,
  categoryId?: string
): Promise<Post[]> => {
  try {
    const snapshot: QuerySnapshot = await postRepository.getAllPosts(page, limit, categoryId);
    const posts: Post[] = snapshot.docs.map((doc) => {
      const data: DocumentData = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        authorId: data.authorId,
        categoryId: data.categoryId,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Post;
    });
    return posts;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Retrieves a single post by ID
 * @param id - The post ID
 * @returns Promise containing the post or null
 */
export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    const doc = await postRepository.getPostById(id);
    if (!doc.exists) {
      return null;
    }
    const data: DocumentData = doc.data()!;
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      categoryId: data.categoryId,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Post;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Creates a new post
 * @param postData - The post data to create
 * @returns Promise containing the created post
 */
export const createPost = async (postData: CreatePostDto): Promise<Post> => {
  try {
    const postId: string = await postRepository.createPost(postData);
    const dateNow = new Date();
    return {
      id: postId,
      ...postData,
      createdAt: dateNow,
      updatedAt: dateNow,
    };
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Updates an existing post
 * @param id - The post ID
 * @param postData - The updated post data
 * @returns Promise containing the updated post
 */
export const updatePost = async (id: string, postData: UpdatePostDto): Promise<Post> => {
  try {
    await postRepository.updatePost(id, postData);
    const updatedPost = await getPostById(id);
    if (!updatedPost) {
      throw new Error('Post not found after update');
    }
    return updatedPost;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Deletes a post by ID
 * @param id - The post ID
 * @returns Promise containing success status
 */
export const deletePost = async (id: string): Promise<boolean> => {
  try {
    await postRepository.deletePost(id);
    return true;
  } catch (error: unknown) {
    throw error;
  }
};