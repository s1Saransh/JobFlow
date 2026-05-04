import Application from '../models/Application.js';

// @desc    Get applications
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create application
// @route   POST /api/applications
// @access  Private
export const createApplication = async (req, res) => {
  try {
    const { company, role, location, status, jobUrl, appliedDate, notes } = req.body;

    if (!company || !role || !location) {
      return res.status(400).json({ message: 'Please provide company, role, and location' });
    }

    const application = await Application.create({
      company,
      role,
      location,
      status: status || 'applied',
      jobUrl,
      appliedDate,
      notes,
      userId: req.user.id,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check for user
    if (application.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check for user
    if (application.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await application.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
