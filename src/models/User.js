import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // opcional si viene por Google
    provider: { type: String, default: 'local' }, // 'local' o 'google'
    googleId: { type: String }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model('User', userSchema);
