import User from '../models/User.js';

// @desc    Get current user's profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update current user's profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, linkedin, bio, avatar } = req.body;

    const updates = {};
    if (name    !== undefined) updates.name     = name;
    if (phone   !== undefined) updates.phone    = phone;
    if (linkedin !== undefined) updates.linkedin = linkedin;
    if (bio     !== undefined) updates.bio      = bio;
    // avatar can be a base64 data URL string or empty string to remove
    if (avatar  !== undefined) updates.avatar   = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
