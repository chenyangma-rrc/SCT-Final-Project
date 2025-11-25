import { Request, Response, NextFunction } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '../../config/firebase';

/**
 * Middleware to authenticate a user using Firebase ID token
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The Express next middleware function
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader: string | undefined = req.headers.authorization;
    
    // Check if header looks like 'Bearer {token}'
    const token: string | undefined = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : undefined;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided'
      });
      return;
    }

    const decodedToken: DecodedIdToken = await auth.verifyIdToken(token);

    // Store user info in res.locals for use in other middleware or routes
    res.locals.uid = decodedToken.uid;
    res.locals.email = decodedToken.email;
    res.locals.role = decodedToken.role || 'user';

    next();
  } catch (_error: unknown) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired token'
    });
  }
};

/**
 * Middleware to require admin role
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The Express next middleware function
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.locals.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access required'
    });
    return;
  }
  next();
};

/**
 * Middleware to require authentication
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The Express next middleware function
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!res.locals.uid) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Authentication required'
    });
    return;
  }
  next();
};