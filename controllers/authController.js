import { APIError } from '../middlewares/errorMiddleware.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import logger from '../logger/logger.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Organization, User } from '../models/index.js';
import registrationSchema from '../validations/registrationVal.js';
import { sanitizeInput, sanitizeObject } from '../utils/index.js';
import customEnv from '../config/customEnv.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

export const register = asyncHandler(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { error, value } = registrationSchema.validate(sanitizedBody, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(422).json({ success: false, errors });
  }

  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email: value.email }, { phone: value.phone }],
    },
  });

  if (existingUser) {
    if (existingUser.email === value.email) {
      throw new APIError('Email already registered', 422);
    }
    if (existingUser.phone === value.phone) {
      throw new APIError('Phone number already registered', 422);
    }
  }

  const { firstName, lastName, email, password, phone } = value;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userId: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const organization = await Organization.create({
      orgId: uuidv4(),
      name: `${firstName}'s Organization`,
      description: '',
    });

    await newUser.addOrganization(organization);

    const token = jwt.sign({ userId: newUser.userId }, customEnv.jwtSecret, {
      expiresIn: customEnv.userAccessTokenExpireTime,
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: newUser.userId,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone,
        },
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400,
    });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      errors: [
        { field: 'email', message: 'Email is required' },
        { field: 'password', message: 'Password is required' },
      ],
    });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    const token = jwt.sign({ userId: user.userId }, customEnv.jwtSecret, {
      expiresIn: customEnv.userAccessTokenExpireTime,
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
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
