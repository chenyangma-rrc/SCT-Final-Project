import { Router } from 'express';
import {
  getAllComments,
  getCommentById,
  createComment,
  deleteComment
} from '../controllers/commentController';
import { validateBody } from '../middleware/validator';
import { createCommentSchema } from '../validators/commentValidator';
import { authenticate, requireAdmin } from '../middleware/auth';

const router: Router = Router();

/**
 * @openapi
 * /api/comments:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get all comments
 *     description: Retrieve a list of all comments in the system
 *     responses:
 *       200:
 *         description: Successfully retrieved all comments
 */
router.get('/', getAllComments);

/**
 * @openapi
 * /api/comments/{id}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved comment
 *       404:
 *         description: Comment not found
 */
router.get('/:id', getCommentById);

/**
 * @openapi
 * /api/comments:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Create a new comment (Authenticated users)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - postId
 *               - userId
 *             properties:
 *               content:
 *                 type: string
 *               postId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, validateBody(createCommentSchema), createComment);

/**
 * @openapi
 * /api/comments/{id}:
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Delete a comment (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete('/:id', authenticate, requireAdmin, deleteComment);

export default router;