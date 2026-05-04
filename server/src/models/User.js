import mongoose from 'mongoose';

/**
 * @typedef {Object} User
 * @property {string} name - The user's full name.
 * @property {string} email - The user's email address, must be unique.
 * @property {string} password - The user's hashed password.
 * @property {Date} createdAt - Timestamp of when the user was created.
 * @property {Date} updatedAt - Timestamp of when the user was last updated.
 */

const userSchema = new mongoose.Schema({
  /**
   * The user's full name.
   * @type {String}
   */
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  /**
   * The user's email address.
   * Used for authentication.
   * @type {String}
   */
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  /**
   * The user's hashed password.
   * @type {String}
   */
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
