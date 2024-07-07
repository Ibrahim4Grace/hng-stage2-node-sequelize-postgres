import express from 'express';
const router = express.Router();

// Import route handlers
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';

// Mount the landing page route
router.use('/auth', authRoutes);
router.use('/api', userRoutes);

export default router;
