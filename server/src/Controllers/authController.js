import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'None',
  maxAge: 60 * 60 * 1000,
};

// Register User
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      weight,
      height,
      medicalHistory,
    } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      age,
      gender,
      weight,
      height,
      medicalHistory,
    });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Set cookie and send response
    res
      .cookie('token', token, cookieOptions)
      .status(201)
      .json({
        success: true,
        token: token,
        user: user,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
        },
      });
  } catch (error) {
    next(error.message || 'Server Error');
  }
};

//Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    //find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    // Check if password exists in the user object
    if (!user.password) {
      return res.status(500).json({
        success: false,
        error: 'Server error - Password not found in database',
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Set cookie and send response
    res
      .cookie('token', token, cookieOptions)
      .status(200)
      .json({
        success: true,
        token: token,
        user: user,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
        },
      });
  } catch (error) {
    next(error.message || 'Server Error');
  }
};

// Logout User
export const logout = (req, res) => {
  // Clear cookie and send response
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
    })
    .status(200)
    .json({ success: true, message: 'Logged out successfully' });
};
