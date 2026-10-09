import mongoose from 'mongoose';

const messageThreadSchema = new mongoose.Schema({
    
  thread_id: { type: String, required: true, unique: true },
  post_id: { type: String, required: true, ref: 'Post' },
  poster_id: { type: String, required: true, ref: 'User'},
  other_user_id: { type: String, required: true, ref: 'User' },
  otherUserDisplayName: { type: String, required: true },
});

// One conversation between these two users for a particular post.
messageThreadSchema.index(
  { post_id: 1, poster_id: 1, other_user_id: 1 },
  { unique: true }
);

export const MessageThread = mongoose.model('MessageThread', messageThreadSchema);