import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { db } from '../config/firebase';
import { swaggerSpec } from '../config/swagger';
import { apiLimiter } from './middleware/rateLimiter';
import categoryRoutes from './routes/category';
import postRoutes from './routes/post';
import commentRoutes from './routes/comment';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/', apiLimiter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Basic health check route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Blog Management API is running',
    firebase: db ? 'connected' : 'not connected'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;