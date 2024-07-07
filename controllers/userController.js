import asyncHandler from '../middlewares/asyncHandler.js';
import logger from '../logger/logger.js';
import { Organisation, User } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

// This endpoint retrieves the user's own record or user records in organisations they belong to or created.
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

// This endpoint retrieves all orgaorganisationnizations the user belongs to or has created.
export const getUserOrganisations = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Organisation,
          as: 'organisations',
          through: { attributes: [] }, // Omit the join table
        },
      ],
    });

    const organisations = user.organisations.map((org) => ({
      orgId: org.orgId,
      name: org.name,
      description: org.description,
    }));

    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: { organisations },
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

// This endpoint retrieves a single organisation record the logged-in user has access to.
export const getOrganisationById = asyncHandler(async (req, res) => {
  const orgId = req.params.orgId;
  const userId = req.user.userId; // Assume req.user is populated by authentication middleware

  try {
    const organisation = await Organisation.findByPk(orgId, {
      include: [
        {
          model: User,
          as: 'users',
          where: { userId },
          attributes: [], // Do not return user details
          required: true, // Inner join, only return organisation the user is part of
        },
      ],
    });

    if (!organisation) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'Organisation not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'organisation record retrieved successfully',
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
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

// This endpoint allows a user to create a new organisation.
export const createOrganisation = asyncHandler(async (req, res) => {
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
    const newOrganisation = await Organisation.create({
      orgId: uuidv4(),
      name,
      description: description || '',
    });

    const user = await User.findByPk(userId);
    await user.addOrganisation(newOrganisation);

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: {
        orgId: newOrganisation.orgId,
        name: newOrganisation.name,
        description: newOrganisation.description,
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

//This endpoint adds a user to a particular organisation
export const addUserToOrganisation = asyncHandler(async (req, res) => {
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
    // Find the organisation by orgId
    const organisation = await Organisation.findByPk(orgId);
    if (!organisation) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'Organisation not found',
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

    // Add the user to the organisation
    await organisation.addUser(user);

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
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
