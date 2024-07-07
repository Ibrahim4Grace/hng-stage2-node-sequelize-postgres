import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import {
  getUserById,
  getUserOrganisations,
  getOrganisationById,
  createOrganisation,
  addUserToOrganisation,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/users/:id', authenticate, getUserById);
router.get('/organisations', authenticate, getUserOrganisations);
router.get('/organisations/:orgId', authenticate, getOrganisationById);
router.post('/organisations', authenticate, createOrganisation);
router.post('/organisations/:orgId/users', authenticate, addUserToOrganisation);

export default router;
