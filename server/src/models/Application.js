import mongoose from 'mongoose';

/**
 * @typedef {Object} Application
 * @property {string} company - The name of the company applied to.
 * @property {string} role - The job title or role applied for.
 * @property {string} location - The location of the job (e.g., Remote, City, State).
 * @property {string} [jobUrl] - A link to the job posting.
 * @property {string} status - The current status of the application.
 * @property {Date} [appliedDate] - The date the application was submitted.
 * @property {Date} [followUpDate] - A scheduled date to follow up on the application.
 * @property {number} [salaryMin] - The minimum expected or offered salary.
 * @property {number} [salaryMax] - The maximum expected or offered salary.
 * @property {string} [notes] - Any additional notes or context about the application.
 * @property {string} [source] - Where the job was found (e.g., LinkedIn, Indeed, Company Site).
 * @property {string} [resumeVersion] - The specific version of the resume used for this application.
 * @property {mongoose.Types.ObjectId} userId - Reference to the user who created this application.
 * @property {Date} createdAt - Timestamp of when the application was created.
 * @property {Date} updatedAt - Timestamp of when the application was last updated.
 */

const applicationSchema = new mongoose.Schema({
  /**
   * The name of the company applied to.
   * @type {String}
   */
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  /**
   * The job title or role applied for.
   * @type {String}
   */
  role: {
    type: String,
    required: [true, 'Role/Job title is required'],
    trim: true,
  },
  /**
   * The location of the job (e.g., Remote, City, State).
   * @type {String}
   */
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  /**
   * A link to the job posting.
   * @type {String}
   */
  jobUrl: {
    type: String,
    trim: true,
  },
  /**
   * The current status of the application.
   * @type {String}
   */
  status: {
    type: String,
    enum: {
      values: ['applied', 'screening', 'interview', 'offer', 'rejected'],
      message: '{VALUE} is not a valid status',
    },
    default: 'applied',
    required: true,
  },
  /**
   * The date the application was submitted.
   * @type {Date}
   */
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  /**
   * A scheduled date to follow up on the application.
   * @type {Date}
   */
  followUpDate: {
    type: Date,
  },
  /**
   * The minimum expected or offered salary.
   * @type {Number}
   */
  salaryMin: {
    type: Number,
    min: 0,
  },
  /**
   * The maximum expected or offered salary.
   * @type {Number}
   */
  salaryMax: {
    type: Number,
    min: 0,
  },
  /**
   * Any additional notes or context about the application.
   * @type {String}
   */
  notes: {
    type: String,
    trim: true,
  },
  /**
   * Where the job was found (e.g., LinkedIn, Indeed, Company Site).
   * @type {String}
   */
  source: {
    type: String,
    trim: true,
  },
  /**
   * The specific version of the resume used for this application.
   * @type {String}
   */
  resumeVersion: {
    type: String,
    trim: true,
  },
  /**
   * Reference to the user who created this application.
   * @type {mongoose.Schema.Types.ObjectId}
   */
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
}, {
  timestamps: true,
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
