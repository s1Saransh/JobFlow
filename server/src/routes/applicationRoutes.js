import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController.js';

const router = express.Router();

// All routes in this file will be protected by the auth middleware
router.use(protect);

router.route('/')
  .get(getApplications)
  .post(createApplication);

router.route('/:id')
  .put(updateApplication)
  .delete(deleteApplication);

export default router;
