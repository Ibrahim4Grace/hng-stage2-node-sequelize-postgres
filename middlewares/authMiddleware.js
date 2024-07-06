import jwt from 'jsonwebtoken';
import customEnv from '../config/customEnv.js';
import User from '../models/user.js'; // Adjust the import path as needed

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'Unauthorized',
      message: 'No token provided',
      statusCode: 401,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, customEnv.jwtSecret);

    const user = await User.findOne({ where: { userId: decoded.userId } });
    if (!user) {
      return res.status(401).json({
        status: 'Unauthorized',
        message: 'User not found',
        statusCode: 401,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'Unauthorized',
      message: 'Token is not valid',
      statusCode: 401,
    });
  }
};
