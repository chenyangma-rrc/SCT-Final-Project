import * as commentService from '../src/services/commentService';
import * as commentRepository from '../src/repositories/commentRepository';

jest.mock('../src/repositories/commentRepository');

describe('Comment Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllComments', () => {
    it('should return all comments', async () => {
      const mockDate = new Date();
      const mockSnapshot = {
        docs: [
          {
            id: 'comment1',
            data: () => ({
              content: 'Great post!',
              postId: 'post1',
              userId: 'user1',
              createdAt: { toDate: () => mockDate },
            }),
          },
          {
            id: 'comment2',
            data: () => ({
              content: 'Very informative',
              postId: 'post1',
              userId: 'user2',
              createdAt: { toDate: () => mockDate },
            }),
          },
        ],
      };

      (commentRepository.getAllComments as jest.Mock).mockResolvedValue(mockSnapshot);

      const result = await commentService.getAllComments();

      expect(result).toHaveLength(2);
      expect(result[0].content).toBe('Great post!');
      expect(result[1].content).toBe('Very informative');
      expect(commentRepository.getAllComments).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCommentById', () => {
    it('should return comment when found', async () => {
      const mockDate = new Date();
      const mockDoc = {
        exists: true,
        id: 'comment1',
        data: () => ({
          content: 'Test comment',
          postId: 'post1',
          userId: 'user1',
          createdAt: { toDate: () => mockDate },
        }),
      };

      (commentRepository.getCommentById as jest.Mock).mockResolvedValue(mockDoc);

      const result = await commentService.getCommentById('comment1');

      expect(result).not.toBeNull();
      expect(result?.content).toBe('Test comment');
      expect(result?.postId).toBe('post1');
      expect(commentRepository.getCommentById).toHaveBeenCalledWith('comment1');
    });

    it('should return null when comment not found', async () => {
      const mockDoc = {
        exists: false,
      };

      (commentRepository.getCommentById as jest.Mock).mockResolvedValue(mockDoc);

      const result = await commentService.getCommentById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createComment', () => {
    it('should create a new comment', async () => {
      const mockCommentData = {
        content: 'This is a test comment',
        postId: 'post1',
        userId: 'user1',
      };

      (commentRepository.createComment as jest.Mock).mockResolvedValue('newCommentId');

      const result = await commentService.createComment(mockCommentData);

      expect(result.id).toBe('newCommentId');
      expect(result.content).toBe('This is a test comment');
      expect(result.postId).toBe('post1');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(commentRepository.createComment).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteComment', () => {
    it('should delete comment successfully', async () => {
      (commentRepository.deleteComment as jest.Mock).mockResolvedValue(undefined);

      const result = await commentService.deleteComment('comment1');

      expect(result).toBe(true);
      expect(commentRepository.deleteComment).toHaveBeenCalledWith('comment1');
    });
  });

  describe('getAllComments with postId filter', () => {
    it('should return comments filtered by postId', async () => {
      const mockDate = new Date();
      const mockSnapshot = {
        docs: [
          {
            id: 'comment1',
            data: () => ({
              content: 'Comment on post1',
              postId: 'post1',
              userId: 'user1',
              createdAt: { toDate: () => mockDate },
            }),
          },
        ],
      };

      (commentRepository.getAllComments as jest.Mock).mockResolvedValue(mockSnapshot);

      const result = await commentService.getAllComments('post1');

      expect(result).toHaveLength(1);
      expect(result[0].postId).toBe('post1');
      expect(commentRepository.getAllComments).toHaveBeenCalledWith('post1');
    });

    it('should return all comments when no postId provided', async () => {
      const mockDate = new Date();
      const mockSnapshot = {
        docs: [
          {
            id: 'comment1',
            data: () => ({
              content: 'Comment 1',
              postId: 'post1',
              userId: 'user1',
              createdAt: { toDate: () => mockDate },
            }),
          },
          {
            id: 'comment2',
            data: () => ({
              content: 'Comment 2',
              postId: 'post2',
              userId: 'user2',
              createdAt: { toDate: () => mockDate },
            }),
          },
        ],
      };

      (commentRepository.getAllComments as jest.Mock).mockResolvedValue(mockSnapshot);

      const result = await commentService.getAllComments();

      expect(result).toHaveLength(2);
      expect(commentRepository.getAllComments).toHaveBeenCalledWith(undefined);
    });
  });

  describe('createComment validation', () => {
    it('should create comment with all required fields', async () => {
      const mockCommentData = {
        content: 'Valid comment content',
        postId: 'validPostId',
        userId: 'validUserId',
      };

      (commentRepository.createComment as jest.Mock).mockResolvedValue('commentId123');

      const result = await commentService.createComment(mockCommentData);

      expect(result.id).toBe('commentId123');
      expect(result.content).toBe('Valid comment content');
      expect(result.postId).toBe('validPostId');
      expect(result.userId).toBe('validUserId');
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('deleteComment verification', () => {
    it('should return true after successful deletion', async () => {
      (commentRepository.deleteComment as jest.Mock).mockResolvedValue(undefined);

      const result = await commentService.deleteComment('comment-to-delete');

      expect(result).toBe(true);
      expect(commentRepository.deleteComment).toHaveBeenCalledWith('comment-to-delete');
      expect(commentRepository.deleteComment).toHaveBeenCalledTimes(1);
    });
  });
});