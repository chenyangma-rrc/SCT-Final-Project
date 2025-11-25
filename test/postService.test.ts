import * as postService from '../src/services/postService';
import * as postRepository from '../src/repositories/postRepository';

jest.mock('../src/repositories/postRepository');

describe('Post Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPosts', () => {
    it('should return all posts', async () => {
      const mockDate = new Date();
      const mockSnapshot = {
        docs: [
          {
            id: 'post1',
            data: () => ({
              title: 'First Post',
              content: 'This is the first post content',
              authorId: 'user1',
              categoryId: 'cat1',
              createdAt: { toDate: () => mockDate },
              updatedAt: { toDate: () => mockDate },
            }),
          },
          {
            id: 'post2',
            data: () => ({
              title: 'Second Post',
              content: 'This is the second post content',
              authorId: 'user2',
              categoryId: 'cat2',
              createdAt: { toDate: () => mockDate },
              updatedAt: { toDate: () => mockDate },
            }),
          },
        ],
      };

      (postRepository.getAllPosts as jest.Mock).mockResolvedValue(mockSnapshot);

      const result = await postService.getAllPosts();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('First Post');
      expect(result[1].title).toBe('Second Post');
      expect(postRepository.getAllPosts).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPostById', () => {
    it('should return post when found', async () => {
      const mockDate = new Date();
      const mockDoc = {
        exists: true,
        id: 'post1',
        data: () => ({
          title: 'Test Post',
          content: 'Test content for the post',
          authorId: 'user1',
          categoryId: 'cat1',
          createdAt: { toDate: () => mockDate },
          updatedAt: { toDate: () => mockDate },
        }),
      };

      (postRepository.getPostById as jest.Mock).mockResolvedValue(mockDoc);

      const result = await postService.getPostById('post1');

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Test Post');
      expect(result?.authorId).toBe('user1');
      expect(postRepository.getPostById).toHaveBeenCalledWith('post1');
    });

    it('should return null when post not found', async () => {
      const mockDoc = {
        exists: false,
      };

      (postRepository.getPostById as jest.Mock).mockResolvedValue(mockDoc);

      const result = await postService.getPostById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const mockPostData = {
        title: 'New Post',
        content: 'This is a new post with enough content to pass validation',
        authorId: 'user1',
        categoryId: 'cat1',
      };

      (postRepository.createPost as jest.Mock).mockResolvedValue('newPostId');

      const result = await postService.createPost(mockPostData);

      expect(result.id).toBe('newPostId');
      expect(result.title).toBe('New Post');
      expect(result.authorId).toBe('user1');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(postRepository.createPost).toHaveBeenCalledTimes(1);
    });
  });

  describe('updatePost', () => {
    it('should update post successfully', async () => {
      const mockDate = new Date();
      const mockUpdatedDoc = {
        exists: true,
        id: 'post1',
        data: () => ({
          title: 'Updated Post Title',
          content: 'Updated content',
          authorId: 'user1',
          categoryId: 'cat1',
          createdAt: { toDate: () => mockDate },
          updatedAt: { toDate: () => mockDate },
        }),
      };

      (postRepository.updatePost as jest.Mock).mockResolvedValue(undefined);
      (postRepository.getPostById as jest.Mock).mockResolvedValue(mockUpdatedDoc);

      const result = await postService.updatePost('post1', { 
        title: 'Updated Post Title' 
      });

      expect(result.title).toBe('Updated Post Title');
      expect(postRepository.updatePost).toHaveBeenCalledWith('post1', expect.any(Object));
    });
  });

  describe('deletePost', () => {
    it('should delete post successfully', async () => {
      (postRepository.deletePost as jest.Mock).mockResolvedValue(undefined);

      const result = await postService.deletePost('post1');

      expect(result).toBe(true);
      expect(postRepository.deletePost).toHaveBeenCalledWith('post1');
    });
  });

  describe('getAllPosts with pagination', () => {
    it('should return posts with pagination parameters', async () => {
      const mockDate = new Date();
      const mockSnapshot = {
        docs: [
          {
            id: 'post1',
            data: () => ({
              title: 'Post 1',
              content: 'Content 1',
              authorId: 'user1',
              categoryId: 'cat1',
              createdAt: { toDate: () => mockDate },
              updatedAt: { toDate: () => mockDate },
            }),
          },
        ],
      };

      (postRepository.getAllPosts as jest.Mock).mockResolvedValue(mockSnapshot);

      const result = await postService.getAllPosts(1, 10);

      expect(result).toHaveLength(1);
      expect(postRepository.getAllPosts).toHaveBeenCalledWith(1, 10, undefined);
    });

    it('should return posts filtered by categoryId', async () => {
      const mockDate = new Date();
      const mockSnapshot = {
        docs: [
          {
            id: 'post1',
            data: () => ({
              title: 'Tech Post',
              content: 'Tech content',
              authorId: 'user1',
              categoryId: 'cat1',
              createdAt: { toDate: () => mockDate },
              updatedAt: { toDate: () => mockDate },
            }),
          },
        ],
      };

      (postRepository.getAllPosts as jest.Mock).mockResolvedValue(mockSnapshot);

      const result = await postService.getAllPosts(1, 10, 'cat1');

      expect(result).toHaveLength(1);
      expect(result[0].categoryId).toBe('cat1');
      expect(postRepository.getAllPosts).toHaveBeenCalledWith(1, 10, 'cat1');
    });

    it('should return posts with both pagination and filter', async () => {
      const mockDate = new Date();
      const mockSnapshot = {
        docs: [
          {
            id: 'post1',
            data: () => ({
              title: 'Filtered Post',
              content: 'Filtered content',
              authorId: 'user1',
              categoryId: 'cat1',
              createdAt: { toDate: () => mockDate },
              updatedAt: { toDate: () => mockDate },
            }),
          },
        ],
      };

      (postRepository.getAllPosts as jest.Mock).mockResolvedValue(mockSnapshot);

      const result = await postService.getAllPosts(2, 5, 'cat1');

      expect(result).toHaveLength(1);
      expect(postRepository.getAllPosts).toHaveBeenCalledWith(2, 5, 'cat1');
    });
  });

  describe('updatePost partial update', () => {
    it('should update only content', async () => {
      const mockDate = new Date();
      const mockUpdatedDoc = {
        exists: true,
        id: 'post1',
        data: () => ({
          title: 'Original Title',
          content: 'New content only',
          authorId: 'user1',
          categoryId: 'cat1',
          createdAt: { toDate: () => mockDate },
          updatedAt: { toDate: () => mockDate },
        }),
      };

      (postRepository.updatePost as jest.Mock).mockResolvedValue(undefined);
      (postRepository.getPostById as jest.Mock).mockResolvedValue(mockUpdatedDoc);

      const result = await postService.updatePost('post1', { 
        content: 'New content only' 
      });

      expect(result.content).toBe('New content only');
      expect(postRepository.updatePost).toHaveBeenCalledTimes(1);
    });
  });

  describe('deletePost verification', () => {
    it('should return true after successful deletion', async () => {
      (postRepository.deletePost as jest.Mock).mockResolvedValue(undefined);

      const result = await postService.deletePost('post-to-delete');

      expect(result).toBe(true);
      expect(postRepository.deletePost).toHaveBeenCalledWith('post-to-delete');
      expect(postRepository.deletePost).toHaveBeenCalledTimes(1);
    });
  });
});
