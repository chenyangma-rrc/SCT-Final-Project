import * as postRepository from '../src/repositories/postRepository';
import { db } from '../config/firebase';

jest.mock('../config/firebase', () => ({
  db: {
    collection: jest.fn(),
  },
}));

describe('Post Repository', () => {
  const mockQuery = {
    where: jest.fn(),
    limit: jest.fn(),
    offset: jest.fn(),
    get: jest.fn(),
  };

  const mockCollection = {
    where: jest.fn(),
    limit: jest.fn(),
    offset: jest.fn(),
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
    mockCollection.where.mockReturnValue(mockQuery);
    mockCollection.limit.mockReturnValue(mockQuery);
    mockCollection.offset.mockReturnValue(mockQuery);
    mockQuery.where.mockReturnValue(mockQuery);
    mockQuery.limit.mockReturnValue(mockQuery);
    mockQuery.offset.mockReturnValue(mockQuery);
    mockCollection.doc.mockReturnValue(mockDoc);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPosts', () => {
    it('should get all posts without filters', async () => {
      mockCollection.get.mockResolvedValue({ docs: [] });

      await postRepository.getAllPosts();

      expect(db.collection).toHaveBeenCalledWith('posts');
      expect(mockCollection.get).toHaveBeenCalled();
    });

    it('should filter posts by categoryId', async () => {
      mockQuery.get.mockResolvedValue({ docs: [] });

      await postRepository.getAllPosts(undefined, undefined, 'cat123');

      expect(mockCollection.where).toHaveBeenCalledWith('categoryId', '==', 'cat123');
      expect(mockQuery.get).toHaveBeenCalled();
    });

    it('should apply pagination', async () => {
        const mockChain = {
          limit: jest.fn().mockReturnThis(),
          offset: jest.fn().mockReturnThis(),
          get: jest.fn().mockResolvedValue({ docs: [] }),
        };
  
        mockCollection.limit.mockReturnValue(mockChain);
  
        await postRepository.getAllPosts(2, 10);
  
        expect(mockCollection.limit).toHaveBeenCalledWith(10);
        expect(mockChain.offset).toHaveBeenCalledWith(10);
        expect(mockChain.get).toHaveBeenCalled();
    });

    it('should apply both filter and pagination', async () => {
      mockQuery.get.mockResolvedValue({ docs: [] });

      await postRepository.getAllPosts(1, 5, 'cat123');

      expect(mockCollection.where).toHaveBeenCalledWith('categoryId', '==', 'cat123');
      expect(mockQuery.limit).toHaveBeenCalledWith(5);
      expect(mockQuery.offset).toHaveBeenCalledWith(0);
    });
  });

  describe('getPostById', () => {
    it('should get post by id', async () => {
      mockDoc.get.mockResolvedValue({ exists: true });

      await postRepository.getPostById('post1');

      expect(db.collection).toHaveBeenCalledWith('posts');
      expect(mockCollection.doc).toHaveBeenCalledWith('post1');
      expect(mockDoc.get).toHaveBeenCalled();
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      mockCollection.add.mockResolvedValue({ id: 'newPostId' });

      const postData = {
        title: 'Test Post',
        content: 'Test content',
        authorId: 'user1',
        categoryId: 'cat1',
      };

      const result = await postRepository.createPost(postData);

      expect(db.collection).toHaveBeenCalledWith('posts');
      expect(mockCollection.add).toHaveBeenCalled();
      expect(result).toBe('newPostId');
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      mockDoc.update.mockResolvedValue(undefined);

      const updateData = {
        title: 'Updated Title',
      };

      await postRepository.updatePost('post1', updateData);

      expect(db.collection).toHaveBeenCalledWith('posts');
      expect(mockCollection.doc).toHaveBeenCalledWith('post1');
      expect(mockDoc.update).toHaveBeenCalled();
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      mockDoc.delete.mockResolvedValue(undefined);

      await postRepository.deletePost('post1');

      expect(db.collection).toHaveBeenCalledWith('posts');
      expect(mockCollection.doc).toHaveBeenCalledWith('post1');
      expect(mockDoc.delete).toHaveBeenCalled();
    });
  });
});