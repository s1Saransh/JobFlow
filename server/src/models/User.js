import mongoose from 'mongoose';

/**
 * @typedef {Object} User
 * @property {string} name - The user's full name.
 * @property {string} email - The user's email address, must be unique.
 * @property {string} password - The user's hashed password.
 * @property {string} [phone] - The user's phone number.
 * @property {string} [linkedin] - The user's LinkedIn profile URL.
 * @property {string} [bio] - A short bio / about section.
 * @property {string} [avatar] - Base64-encoded profile picture data URL.
 * @property {Date} createdAt - Timestamp of when the user was created.
 * @property {Date} updatedAt - Timestamp of when the user was last updated.
 */

const userSchema = new mongoose.Schema({
  /** The user's full name. */
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  /** The user's email address. Used for authentication. */
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  /** The user's hashed password. */
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  /** The user's phone number (optional). */
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  /** LinkedIn profile URL (optional). */
  linkedin: {
    type: String,
    trim: true,
    default: '',
  },
  /** Short bio (optional). */
  bio: {
    type: String,
    trim: true,
    default: '',
  },
  /** Base64 data URL for profile avatar (optional). */
  avatar: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
