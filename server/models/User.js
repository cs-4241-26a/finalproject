import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    
  user_id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true, sparse: true },
  password: { type: String, required: true },
  display_name: { type: String, required: true },
  residence: { type: String, default: '' },
  created: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);