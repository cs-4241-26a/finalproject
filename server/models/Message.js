import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    
  message_id: { type: String, required: true, unique: true },
  thread_id: { type: String, required: true},
  post_id: { type: String, required: true, ref: 'Post' },
  sender_id: { type: String, required: true, ref: 'User' },
  recipient_id: { type: String, required: true, ref: 'User' },
  body: { type: String, required: true },
  imageData: { type: String, default: '' },
  time: { type: Date, default: Date.now }
});

messageSchema.index({thread_id: 1, time: 1});

export const Message = mongoose.model('Message', messageSchema);