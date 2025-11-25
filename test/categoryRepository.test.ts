import * as categoryRepository from '../src/repositories/categoryRepository';
import { db } from '../config/firebase';

jest.mock('../config/firebase', () => ({
  db: {
    collection: jest.fn(),
  },
}));

describe('Category Repository', () => {
  const mockCollection = {
    get: jest.fn(),
    doc: jest.fn(),
    add: jest.fn(),
  };

  const mockDoc = {
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    (db.collection as jest.Mock).mockReturnValue(mockCollection);
    mockCollection.doc.mockReturnValue(mockDoc);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should call Firestore collection get', async () => {
      mockCollection.get.mockResolvedValue({ docs: [] });

      await categoryRepository.getAllCategories();

      expect(db.collection).toHaveBeenCalledWith('categories');
      expect(mockCollection.get).toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should call Firestore doc get', async () => {
      mockDoc.get.mockResolvedValue({ exists: true });

      await categoryRepository.getCategoryById('cat1');

      expect(db.collection).toHaveBeenCalledWith('categories');
      expect(mockCollection.doc).toHaveBeenCalledWith('cat1');
      expect(mockDoc.get).toHaveBeenCalled();
    });
  });

  describe('createCategory', () => {
    it('should call Firestore collection add', async () => {
      mockCollection.add.mockResolvedValue({ id: 'newId' });

      const categoryData = {
        name: 'Test',
        description: 'Test description',
      };

      await categoryRepository.createCategory(categoryData);

      expect(db.collection).toHaveBeenCalledWith('categories');
      expect(mockCollection.add).toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    it('should call Firestore doc delete', async () => {
      mockDoc.delete.mockResolvedValue(undefined);

      await categoryRepository.deleteCategory('cat1');

      expect(db.collection).toHaveBeenCalledWith('categories');
      expect(mockCollection.doc).toHaveBeenCalledWith('cat1');
      expect(mockDoc.delete).toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    it('should call Firestore doc update', async () => {
      mockDoc.update.mockResolvedValue(undefined);

      const updateData = {
        name: 'Updated Name',
      };

      await categoryRepository.updateCategory('cat1', updateData);

      expect(db.collection).toHaveBeenCalledWith('categories');
      expect(mockCollection.doc).toHaveBeenCalledWith('cat1');
      expect(mockDoc.update).toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    it('should call Firestore doc update', async () => {
      mockDoc.update.mockResolvedValue(undefined);

      const updateData = {
        name: 'Updated Name',
        description: 'Updated description',
      };

      await categoryRepository.updateCategory('cat1', updateData);

      expect(db.collection).toHaveBeenCalledWith('categories');
      expect(mockCollection.doc).toHaveBeenCalledWith('cat1');
      expect(mockDoc.update).toHaveBeenCalled();
    });
  });
});