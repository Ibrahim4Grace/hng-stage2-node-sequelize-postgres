import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import {
  getUserById,
  getUserOrganizations,
  getOrganizationById,
  createOrganization,
  addUserToOrganization,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/users/:id', authenticate, getUserById);
router.get('/organizations', authenticate, getUserOrganizations);
router.get('/organizations/:orgId', authenticate, getOrganizationById);
router.post('/organizations', authenticate, createOrganization);
router.post('/organizations/:orgId/users', authenticate, addUserToOrganization);

export default router;
