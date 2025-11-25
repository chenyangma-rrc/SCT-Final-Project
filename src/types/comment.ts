/**
 * Comment interface representing a comment on a post
 */
export interface Comment {
    id: string;
    content: string;
    postId: string;
    userId: string;
    createdAt: Date;
  }
  
  /**
   * Data required to create a new comment
   */
  export interface CreateCommentDto {
    content: string;
    postId: string;
    userId: string;
  }
  
  /**
   * Data for updating a comment
   */
  export interface UpdateCommentDto {
    content?: string;
  }