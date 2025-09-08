import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      console.log('No token provided in protect middleware');
      return res.status(401).json({
        success: false,
        error: 'Not authorized - No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error authorizing user:', error.message);
    next(error.message || 'Not authorized - Token failed');
  }
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(error.message || 'Token verification failed');
  }
};
