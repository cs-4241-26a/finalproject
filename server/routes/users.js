import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Message } from '../models/Message.js';
import { sendResponse } from '../utils/response.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();


router.post('/', async (req, res) => {

  try {

    const { username, password, display_name, residence } = req.body;
    if (!username || !password || !display_name) {

      return sendResponse(res, 400, {}, "Missing required fields", false);
    }

    const existing = await User.findOne({ username });
    if (existing) {

      return sendResponse(res, 409, {}, "Username already taken", false);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = crypto.randomUUID();

    const newUser = await User.create({
      user_id,
      username,
      password: hashedPassword,
      display_name,
      residence: residence || '',
      created: new Date()
    });

    return sendResponse(res, 201, {

      user_id: newUser.user_id,
      display_name: newUser.display_name,
      residence: newUser.residence,
      created: newUser.created
    }, "User created successfully", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});


router.post('/edit', requireAuth, async (req, res) => {

  try {

    const { display_name, residence, password } = req.body;
    const user = await User.findOne({ user_id: req.user.user_id });
    if (!user) {

      return sendResponse(res, 404, {}, "User not found", false);
    }

    if (display_name) user.display_name = display_name;
    if (residence !== undefined) user.residence = residence;
    if (password) {

      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();

    return sendResponse(res, 200, {

      user_id: user.user_id,
      display_name: user.display_name,
      residence: user.residence,
      created: user.created
    }, "User updated successfully", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});


router.delete('/', requireAuth, async (req, res) => {

  try {

    const user = await User.findOne({ user_id: req.user.user_id });
    if (!user) {

      return sendResponse(res, 404, {}, "User not found", false);
    }

    const deletedUserData = {

      user_id: user.user_id,
      display_name: user.display_name,
      residence: user.residence,
      created: user.created
    };

    await Post.deleteMany({ user_id: user.user_id });

    await Message.updateMany(

      { sender_id: user.user_id },
      { $set: { sender_id: "0" } }
    );
    await Message.updateMany(

      { recipient_id: user.user_id },
      { $set: { recipient_id: "0" } }
    );

    await User.deleteOne({ user_id: user.user_id });

    return sendResponse(res, 200, deletedUserData, "Account deleted successfully", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});

router.get('/:user_id', requireAuth, async (req, res) => {

  try {

    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) {

      return sendResponse(res, 404, {}, "User not found", false);
    }

    return sendResponse(res, 200, {

      user_id: user.user_id,
      display_name: user.display_name,
      residence: user.residence,
      created: user.created
    }, "User retrieved successfully", true);
  } 
  catch (error) {
    
    return sendResponse(res, 500, {}, error.message, false);
  }
});

export default router;