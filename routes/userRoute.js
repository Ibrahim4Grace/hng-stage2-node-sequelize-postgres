// /routes/userRoutes.js
import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// Define routes and map them to controller methods
router.post('/users', userController.createUser); // Create a new user
router.get('/users/:id', userController.getUserById); // Get a user by ID
router.put('/users/:id', userController.updateUser); // Update a user by ID
router.delete('/users/:id', userController.deleteUser); // Delete a user by ID
router.get('/users', userController.getAllUsers); // Get all users

export default router;
