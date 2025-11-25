/**
 * Post interface representing a blog post
 */
export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  /**
   * Data required to create a new post
   */
  export interface CreatePostDto {
    title: string;
    content: string;
    authorId: string;
    categoryId: string;
  }
  
  /**
   * Data for updating a post
   */
  export interface UpdatePostDto {
    title?: string;
    content?: string;
    categoryId?: string;
  }