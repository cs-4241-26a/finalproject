import express from 'express';
import crypto from 'crypto';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { Message } from '../models/Message.js';
import { MessageThread } from '../models/MessageThread.js';
import { sendResponse } from '../utils/response.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();


router.get('/board', requireAuth, async (req, res) => {

  try {

    const posts = await Post.find().sort({ created: -1 });
    const boardData = {};

    await Promise.all(
      posts.map(async (post) => {
        const user = await User.findOne({ user_id: post.user_id });

        boardData[post.post_id] = {
          post_id: post.post_id,
          user_id: post.user_id,
          userDisplayName: user.display_name,
          title: post.title,
          postType: post.postType,
          isResolved: post.isResolved,
          created: post.created,
          imageData: post.imageData || ''
        };
      })
    );

    return sendResponse(res, 200, boardData, "Board retrieved successfully", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});


router.post('/post', requireAuth, async (req, res) => {

  try {

    const { title, description, postType, imageData } = req.body;
    if (!title) {

      return sendResponse(res, 400, {}, "Title is required", false);
    }

    if (!postType || (postType !== "Lost" && postType !== "Found")) {
      return sendResponse(res, 400, {}, "postType must be 'Lost' or 'Found'", false);
    }

    const post_id = crypto.randomUUID();
    const newPost = await Post.create({

      post_id,
      user_id: req.user.user_id,
      title,
      description: description || '',
      postType: postType,
      isResolved: false,
      imageData: imageData || '',
      created: new Date()
    });

    return sendResponse(res, 201, {

      post_id: newPost.post_id,
      user_id: newPost.user_id,
      title: newPost.title,
      description: newPost.description,
      postType: newPost.postType,
      isResolved: newPost.isResolved,
      imageData: newPost.imageData
    }, "Post created successfully", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});


router.get('/post/:post_id', requireAuth, async (req, res) => {

  try {

    const post = await Post.findOne({ post_id: req.params.post_id });
    if (!post) {
      return sendResponse(res, 404, {}, "Post not found", false);
    }

    const user = await User.findOne({user_id: post.user_id});

    return sendResponse(res, 200, {

      post_id: post.post_id,
      user_id: post.user_id,
      userDisplayName: user?.display_name || '',
      title: post.title,
      description: post.description,
      postType: post.postType,
      isResolved: post.isResolved,
      created: post.created,
      imageData: post.imageData || ''
    }, "Post retrieved successfully", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});


router.post('/post/resolve/:post_id', requireAuth, async (req, res) => {

  try {

    const post = await Post.findOne({ post_id: req.params.post_id });
    if (!post) return sendResponse(res, 404, {}, "Post not found", false);
    if (post.user_id !== req.user.user_id) {

      return sendResponse(res, 403, {}, "Unauthorized to resolve this post", false);
    }
    const user = await User.findOne({user_id: post.user_id});
    post.isResolved = true;
    await post.save();

    return sendResponse(res, 200, {

      post_id: post.post_id,
      user_id: user.user_id,
      userDisplayName: user.display_name,
      title: post.title,
      description: post.description,
      postType: post.postType,
      isResolved: post.isResolved,
      created: post.created,
      imageData: post.imageData || ''
    }, "Post resolved successfully", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});


router.post('/post/edit', requireAuth, async (req, res) => {

  try {

    const { post_id, title, description, postType, imageData } = req.body;
    const post = await Post.findOne({ post_id });
    if (!post) return sendResponse(res, 404, {}, "Post not found", false);
    if (post.user_id !== req.user.user_id) {
      return sendResponse(res, 403, {}, "Unauthorized to edit this post", false);
    }
    if (post.isResolved) {
      return sendResponse(res, 400, {}, "Cannot edit a resolved post", false);
    }

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;
    if (postType === "Lost" || postType === "Found") post.postType = postType;
    if (imageData !== undefined) post.imageData = imageData;
    await post.save();

    const user = await User.findOne({user_id: post.user_id});

    return sendResponse(res, 200, {

      post_id: post.post_id,
      user_id: post.user_id,
      userDisplayName: user.display_name,
      title: post.title,
      description: post.description,
      postType: post.postType,
      isResolved: post.isResolved,
      created: post.created,
      imageData: post.imageData
    }, "Post updated successfully", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});


router.delete('/post/:post_id', requireAuth, async (req, res) => {

  try {

    const post = await Post.findOne({ post_id: req.params.post_id });
    if (!post) return sendResponse(res, 404, {}, "Post not found", false);
    if (post.user_id !== req.user.user_id) {

      return sendResponse(res, 403, {}, "Unauthorized to delete this post", false);
    }

    await Message.deleteMany({ post_id: post.post_id });
    await MessageThread.deleteMany({post_id: post.post_id});
    await Post.deleteOne({ post_id: post.post_id });

    return sendResponse(res, 200, {

      post_id: post.post_id,
      user_id: post.user_id,
      title: post.title,
      postType: post.postType,
      isResolved: post.isResolved,
      imageData: post.imageData
    }, "Post and associated messages deleted successfully", true);
  } 
  catch (error) {
    return sendResponse(res, 500, {}, error.message, false);
  }
});

export default router;