import { APIError } from './middleware/errorMiddleware.js';
import * as userService from '../services/userService.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import logger from '../logger/logger.js';

// Create a new user
export const createUser = asyncHandler(async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get a user by ID
export const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      throw new APIError('User not found', 404);
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update a user by ID
export const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      throw new APIError('User not found', 404);
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete a user by ID
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      throw new APIError('User not found', 404);
    }

    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
