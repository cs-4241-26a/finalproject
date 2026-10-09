import express from 'express';
import crypto from 'crypto';

import { Message } from '../models/Message.js';
import { MessageThread } from '../models/MessageThread.js';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';

import { sendResponse } from '../utils/response.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/post/:post_id/thread', requireAuth, async (req, res) => {
  try {
    console.log("messages.js Checkpoint: 16 | req.user: ");
    console.dir(req.user, {depth: null});
    const post_id = req.params.post_id;
    const currentUserId = req.user.user_id;

    const post = await Post.findOne({ post_id });

    if (!post) {
      return sendResponse(res, 404, {}, "Post not found", false);
    }
    console.log("messages.js Checkpoint: 26");
    // The poster does not need to create a thread with themselves.
    if (post.user_id === currentUserId) {
      return sendResponse(res, 400, {}, "The post owner cannot create a thread with themselves", false);
    }
    console.log("messages.js Checkpoint: 31");
    const poster = await User.findOne({
      user_id: post.user_id
    });
    console.log("messages.js Checkpoint: 35");
    if (!poster) {
      return sendResponse(res, 404, {}, "Post owner not found", false);
    }
    console.log("messages.js Checkpoint: 39");
    // Find the existing conversation first.
    let thread = await MessageThread.findOne({
      post_id,
      poster_id: post.user_id,
      other_user_id: currentUserId
    });
    console.log("messages.js Checkpoint: 46 | thread:" + thread);
    // If it doesn't exist, create it.
    if (!thread) {
      const thread_id = crypto.randomUUID();
      console.log("messages.js Checkpoint: 50");
      thread = await MessageThread.create({
        thread_id,
        post_id,
        poster_id: post.user_id,
        other_user_id: currentUserId,
        otherUserDisplayName: req.user.display_name
      });
      console.log("messages.js Checkpoint: 58");
      console.log(`messages.js 59: otherUserDisplayName: ${thread.otherUserDisplayName}`);
    }

    return sendResponse(res, 200,
      {
        thread_id: thread.thread_id,
        post_id: thread.post_id,
        poster_id: thread.poster_id,
        other_user_id: thread.other_user_id,
        otherUserDisplayName: thread.otherUserDisplayName
      },
      "Message thread retrieved successfully", true
    );
  } catch (error) {
    return sendResponse( res, 500, {}, error.message, false);
  }
});

router.get('/post/:post_id/threads', requireAuth, async (req, res) => {
  try {
    const post_id = req.params.post_id;
    const currentUserId = req.user.user_id;

    const post = await Post.findOne({ post_id });

    if (!post) {
      return sendResponse(res, 404, {}, "Post not found", false);
    }

    let threads;

    if (post.user_id === currentUserId) {
      // Poster can see every conversation.
      threads = await MessageThread.find({
        post_id
      }).sort({ thread_id: 1 });
    } else {
      // Other users can only see their own conversation.
      threads = await MessageThread.find({
        post_id,
        other_user_id: currentUserId
      });
    }

    const threadData = await Promise.all(
      threads.map(async (thread) => {
        const otherUserId = thread.poster_id === currentUserId ? thread.other_user_id : thread.poster_id;

        const otherUser = await User.findOne({
          user_id: otherUserId
        });

        return {
          thread_id: thread.thread_id,
          post_id: thread.post_id,
          other_user_id: otherUserId,
          otherUserDisplayName: otherUser?.display_name || thread.otherUserDisplayName
        };
      })
    );

    return sendResponse(res, 200, threadData, "Message threads retrieved successfully", true);
  } catch (error) {
    return sendResponse(res, 500, {}, error.message, false);
  }
});

router.get('/thread/:thread_id', requireAuth, async (req, res) => {
  try {
    const thread = await MessageThread.findOne({
      thread_id: req.params.thread_id
    });

    if (!thread) {
      return sendResponse(res, 404, {}, "Message thread not found", false);
    }

    const currentUserId = req.user.user_id;

    const isParticipant = thread.poster_id === currentUserId || thread.other_user_id === currentUserId;

    if (!isParticipant) {
      return sendResponse(res, 403, {}, "Unauthorized to view this message thread", false);
    }

    const messages = await Message.find({
      thread_id: thread.thread_id
    }).sort({ time: 1 });

    return sendResponse(res, 200, messages, "Messages retrieved successfully", true);
  } catch (error) {
    return sendResponse(res, 500, {}, error.message, false);
  }
});

router.post('/thread/:thread_id', requireAuth, async (req, res) => {
  try {
    const thread_id = req.params.thread_id;
    const { body, imageData } = req.body;

    if (!body || !body.trim()) {
      return sendResponse(res, 400, {}, "Message body is required", false);
    }

    const thread = await MessageThread.findOne({thread_id});

    if (!thread) {
      return sendResponse(res, 404, {}, "Message thread not found", false);
    }

    const currentUserId = req.user.user_id;

    const isPoster = thread.poster_id === currentUserId;

    const isOtherUser = thread.other_user_id === currentUserId;

    if (!isPoster && !isOtherUser) {
      return sendResponse(res, 403, {}, "Unauthorized to send messages in this thread", false);
    }

    const recipient_id = isPoster ? thread.other_user_id : thread.poster_id;

    const message_id = crypto.randomUUID();

    const newMessage = await Message.create({
      message_id,
      thread_id,
      post_id: thread.post_id,
      sender_id: currentUserId,
      recipient_id,
      body: body.trim(),
      imageData: imageData || '',
      time: new Date()
    });

    return sendResponse(res, 201,
      {
        message_id: newMessage.message_id,
        thread_id: newMessage.thread_id,
        post_id: newMessage.post_id,
        sender_id: newMessage.sender_id,
        recipient_id: newMessage.recipient_id,
        body: newMessage.body,
        time: newMessage.time,
        imageData: newMessage.imageData
      },
      "Message sent successfully", true
    );
  } catch (error) {
    return sendResponse(res, 500, {}, error.message, false);
  }
});

export default router;