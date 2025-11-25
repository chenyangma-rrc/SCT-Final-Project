import * as commentRepository from '../src/repositories/commentRepository';
import { db } from '../config/firebase';

jest.mock('../config/firebase', () => ({
  db: {
    collection: jest.fn(),
  },
}));

describe('Comment Repository', () => {
  const mockQuery = {
    where: jest.fn(),
    get: jest.fn(),
  };

  const mockCollection = {
    where: jest.fn(),
    get: jest.fn(),
    doc: jest.fn(),
    add: jest.fn(),
  };

  const mockDoc = {
    get: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    (db.collection as jest.Mock).mockReturnValue(mockCollection);
    mockCollection.where.mockReturnValue(mockQuery);
    mockQuery.where.mockReturnValue(mockQuery);
    mockCollection.doc.mockReturnValue(mockDoc);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllComments', () => {
    it('should get all comments without filter', async () => {
      mockCollection.get.mockResolvedValue({ docs: [] });

      await commentRepository.getAllComments();

      expect(db.collection).toHaveBeenCalledWith('comments');
      expect(mockCollection.get).toHaveBeenCalled();
    });

    it('should filter comments by postId', async () => {
      mockQuery.get.mockResolvedValue({ docs: [] });

      await commentRepository.getAllComments('post123');

      expect(mockCollection.where).toHaveBeenCalledWith('postId', '==', 'post123');
      expect(mockQuery.get).toHaveBeenCalled();
    });
  });

  describe('getCommentById', () => {
    it('should get comment by id', async () => {
      mockDoc.get.mockResolvedValue({ exists: true });

      await commentRepository.getCommentById('comment1');

      expect(db.collection).toHaveBeenCalledWith('comments');
      expect(mockCollection.doc).toHaveBeenCalledWith('comment1');
      expect(mockDoc.get).toHaveBeenCalled();
    });
  });

  describe('createComment', () => {
    it('should create a new comment', async () => {
      mockCollection.add.mockResolvedValue({ id: 'newCommentId' });

      const commentData = {
        content: 'Test comment',
        postId: 'post1',
        userId: 'user1',
      };

      const result = await commentRepository.createComment(commentData);

      expect(db.collection).toHaveBeenCalledWith('comments');
      expect(mockCollection.add).toHaveBeenCalled();
      expect(result).toBe('newCommentId');
    });
  });

  describe('deleteComment', () => {
    it('should delete comment', async () => {
      mockDoc.delete.mockResolvedValue(undefined);

      await commentRepository.deleteComment('comment1');

      expect(db.collection).toHaveBeenCalledWith('comments');
      expect(mockCollection.doc).toHaveBeenCalledWith('comment1');
      expect(mockDoc.delete).toHaveBeenCalled();
    });
  });
});