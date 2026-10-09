import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({

  post_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  postType: { type: String, required: true, default: 'Lost'},
  isResolved: { type: Boolean, required: true, default: false },
  imageData: { type: String, default: '' },
  created: { type: Date, default: Date.now }
});

export const Post = mongoose.model('Post', postSchema);