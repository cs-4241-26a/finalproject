import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { sendResponse } from '../utils/response.js';
import { requireAuth, activeTokens } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {

  try {
    const env = process.env.NODE_ENV;

    const { username, password } = req.body;
    if (!username || !password) {

      return sendResponse(res, 400, {}, "Username and password are required", false);
    }

    const user = await User.findOne({ username });
    if (!user) {

      return sendResponse(res, 401, {}, "Invalid credentials", false);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {

      return sendResponse(res, 401, {}, "Invalid credentials", false);
    }

    const token = jwt.sign(

      { user_id: user.user_id, username: user.username, display_name: user.display_name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    activeTokens.add(token);
    res.cookie(
      'sessionToken', 
      token, {
        httpOnly: true, 
        secure: env === 'production', 
        sameSite: env === 'production' ? 'none' : 'Lax', 
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    return sendResponse(res, 200, {
        user_id: user.user_id,
        display_name: user.display_name,
        residence: user.residence,
        created: user.created
      }, "Login successful", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});

router.get('/logout', requireAuth, (req, res) => {
  
  activeTokens.delete(req.token);
  res.clearCookie('sessionToken');
  return sendResponse(res, 200, {}, "Logged out successfully", true);
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      user_id: req.user.user_id
    });

    if (!user) {
      return sendResponse(res, 404, {}, "User not found", false);
    }

    return sendResponse(
      res, 200,
      {
        user_id: user.user_id,
        display_name: user.display_name,
        residence: user.residence,
        created: user.created
      },
      "Current user retrieved", true
    );
  } catch (error) {
    return sendResponse(res, 500, {}, error.message, false);
  }
});

export default router;