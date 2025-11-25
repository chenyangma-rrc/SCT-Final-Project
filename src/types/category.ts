/**
 * Category interface representing a blog category
 */
export interface Category {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  /**
   * Data required to create a new category
   */
  export interface CreateCategoryDto {
    name: string;
    description: string;
  }
  
  /**
   * Data for updating a category
   */
  export interface UpdateCategoryDto {
    name?: string;
    description?: string;
  }