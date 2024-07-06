import asyncHandler from '../middlewares/asyncHandler.js';
import logger from '../logger/logger.js';
import { Organization, User } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

// This endpoint retrieves the user's own record or user records in organizations they belong to or created.
export const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const loggedInUserId = req.user.userId; // Assume req.user is populated by authentication middleware

  if (userId !== loggedInUserId) {
    return res.status(403).json({
      status: 'Forbidden',
      message: "You are not allowed to access this user's information",
      statusCode: 403,
    });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'User not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User record retrieved successfully',
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred',
      statusCode: 500,
    });
  }
});

// This endpoint retrieves all organizations the user belongs to or has created.
export const getUserOrganizations = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Organization,
          as: 'organizations',
          through: { attributes: [] }, // Omit the join table
        },
      ],
    });

    const organizations = user.organizations.map((org) => ({
      orgId: org.orgId,
      name: org.name,
      description: org.description,
    }));

    res.status(200).json({
      status: 'success',
      message: 'Organizations retrieved successfully',
      data: { organizations },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred',
      statusCode: 500,
    });
  }
});

// This endpoint retrieves a single organization record the logged-in user has access to.
export const getOrganizationById = asyncHandler(async (req, res) => {
  const orgId = req.params.orgId;
  const userId = req.user.userId; // Assume req.user is populated by authentication middleware

  try {
    const organization = await Organization.findByPk(orgId, {
      include: [
        {
          model: User,
          as: 'users',
          where: { userId },
          attributes: [], // Do not return user details
          required: true, // Inner join, only return organizations the user is part of
        },
      ],
    });

    if (!organization) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'Organization not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Organization record retrieved successfully',
      data: {
        orgId: organization.orgId,
        name: organization.name,
        description: organization.description,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred',
      statusCode: 500,
    });
  }
});

// This endpoint allows a user to create a new organization.
export const createOrganization = asyncHandler(async (req, res) => {
  const userId = req.user.userId; // Assume req.user is populated by authentication middleware
  const { name, description } = req.body;

  // Simple validation
  if (!name || typeof name !== 'string') {
    return res.status(400).json({
      status: 'Bad Request',
      message: 'Client error',
      statusCode: 400,
    });
  }

  try {
    const newOrganization = await Organization.create({
      orgId: uuidv4(),
      name,
      description: description || '',
    });

    const user = await User.findByPk(userId);
    await user.addOrganization(newOrganization);

    res.status(201).json({
      status: 'success',
      message: 'Organization created successfully',
      data: {
        orgId: newOrganization.orgId,
        name: newOrganization.name,
        description: newOrganization.description,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred',
      statusCode: 500,
    });
  }
});

//This endpoint adds a user to a particular organization
export const addUserToOrganization = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  // Validate request body
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({
      status: 'Bad Request',
      message: 'Client error: Missing or invalid userId',
      statusCode: 400,
    });
  }

  try {
    // Find the organization by orgId
    const organization = await Organization.findByPk(orgId);
    if (!organization) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'Organization not found',
        statusCode: 404,
      });
    }

    // Find the user by userId
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'User not found',
        statusCode: 404,
      });
    }

    // Add the user to the organization
    await organization.addUser(user);

    res.status(200).json({
      status: 'success',
      message: 'User added to organization successfully',
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred',
      statusCode: 500,
    });
  }
});
