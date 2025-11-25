import * as categoryService from '../src/services/categoryService';
import * as categoryRepository from '../src/repositories/categoryRepository';

jest.mock('../src/repositories/categoryRepository');

describe('Category Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const mockDate = new Date();
      const mockSnapshot = {
        docs: [
          {
            id: 'cat1',
            data: () => ({
              name: 'Technology',
              description: 'Tech posts',
              createdAt: { toDate: () => mockDate },
              updatedAt: { toDate: () => mockDate },
            }),
          },
          {
            id: 'cat2',
            data: () => ({
              name: 'Sports',
              description: 'Sports posts',
              createdAt: { toDate: () => mockDate },
              updatedAt: { toDate: () => mockDate },
            }),
          },
        ],
      };

      (categoryRepository.getAllCategories as jest.Mock).mockResolvedValue(mockSnapshot);

      const result = await categoryService.getAllCategories();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Technology');
      expect(result[1].name).toBe('Sports');
      expect(categoryRepository.getAllCategories).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCategoryById', () => {
    it('should return category when found', async () => {
      const mockDate = new Date();
      const mockDoc = {
        exists: true,
        id: 'cat1',
        data: () => ({
          name: 'Technology',
          description: 'Tech posts',
          createdAt: { toDate: () => mockDate },
          updatedAt: { toDate: () => mockDate },
        }),
      };

      (categoryRepository.getCategoryById as jest.Mock).mockResolvedValue(mockDoc);

      const result = await categoryService.getCategoryById('cat1');

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Technology');
      expect(categoryRepository.getCategoryById).toHaveBeenCalledWith('cat1');
    });

    it('should return null when category not found', async () => {
      const mockDoc = {
        exists: false,
      };

      (categoryRepository.getCategoryById as jest.Mock).mockResolvedValue(mockDoc);

      const result = await categoryService.getCategoryById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const mockCategoryData = {
        name: 'Sports',
        description: 'Sports related posts',
      };

      (categoryRepository.createCategory as jest.Mock).mockResolvedValue('newId123');

      const result = await categoryService.createCategory(mockCategoryData);

      expect(result.id).toBe('newId123');
      expect(result.name).toBe('Sports');
      expect(result.description).toBe('Sports related posts');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(categoryRepository.createCategory).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateCategory', () => {
    it('should update category successfully', async () => {
      const mockDate = new Date();
      const mockUpdatedDoc = {
        exists: true,
        id: 'cat1',
        data: () => ({
          name: 'Updated Tech',
          description: 'Updated description',
          createdAt: { toDate: () => mockDate },
          updatedAt: { toDate: () => mockDate },
        }),
      };

      (categoryRepository.updateCategory as jest.Mock).mockResolvedValue(undefined);
      (categoryRepository.getCategoryById as jest.Mock).mockResolvedValue(mockUpdatedDoc);

      const result = await categoryService.updateCategory('cat1', { 
        name: 'Updated Tech' 
      });

      expect(result.name).toBe('Updated Tech');
      expect(categoryRepository.updateCategory).toHaveBeenCalledWith('cat1', expect.any(Object));
    });
  });

  describe('deleteCategory', () => {
    it('should delete category successfully', async () => {
      (categoryRepository.deleteCategory as jest.Mock).mockResolvedValue(undefined);

      const result = await categoryService.deleteCategory('cat1');

      expect(result).toBe(true);
      expect(categoryRepository.deleteCategory).toHaveBeenCalledWith('cat1');
    });
  });

  describe('getCategoryById edge cases', () => {
    it('should handle invalid category ID', async () => {
      const mockDoc = {
        exists: false,
      };

      (categoryRepository.getCategoryById as jest.Mock).mockResolvedValue(mockDoc);

      const result = await categoryService.getCategoryById('invalid-id-123');

      expect(result).toBeNull();
      expect(categoryRepository.getCategoryById).toHaveBeenCalledWith('invalid-id-123');
    });
  });

  describe('createCategory with minimal data', () => {
    it('should create category with only required fields', async () => {
      const mockCategoryData = {
        name: 'Minimal',
        description: 'Min desc',
      };

      (categoryRepository.createCategory as jest.Mock).mockResolvedValue('minimalId');

      const result = await categoryService.createCategory(mockCategoryData);

      expect(result.id).toBe('minimalId');
      expect(result.name).toBe('Minimal');
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });
  });

  describe('updateCategory partial update', () => {
    it('should update only description', async () => {
      const mockDate = new Date();
      const mockUpdatedDoc = {
        exists: true,
        id: 'cat1',
        data: () => ({
          name: 'Technology',
          description: 'New description only',
          createdAt: { toDate: () => mockDate },
          updatedAt: { toDate: () => mockDate },
        }),
      };

      (categoryRepository.updateCategory as jest.Mock).mockResolvedValue(undefined);
      (categoryRepository.getCategoryById as jest.Mock).mockResolvedValue(mockUpdatedDoc);

      const result = await categoryService.updateCategory('cat1', { 
        description: 'New description only' 
      });

      expect(result.description).toBe('New description only');
      expect(categoryRepository.updateCategory).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteCategory verification', () => {
    it('should return true after successful deletion', async () => {
      (categoryRepository.deleteCategory as jest.Mock).mockResolvedValue(undefined);

      const result = await categoryService.deleteCategory('cat-to-delete');

      expect(result).toBe(true);
      expect(categoryRepository.deleteCategory).toHaveBeenCalledWith('cat-to-delete');
      expect(categoryRepository.deleteCategory).toHaveBeenCalledTimes(1);
    });
  });
});