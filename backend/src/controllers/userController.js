import { getDashboardData, getUserProfile, updateUserProfile } from '../services/userService.js';

export async function fetchProfile(req, res, next) {
  try {
    const user = await getUserProfile(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
}

export async function editProfile(req, res, next) {
  try {
    const user = await updateUserProfile(req.user._id, req.body);

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    return res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    return next(error);
  }
}

export async function fetchDashboard(req, res, next) {
  try {
    const dashboard = await getDashboardData(req.user._id);

    if (!dashboard) {
      return res.status(404).json({ message: 'User dashboard not found' });
    }

    return res.json(dashboard);
  } catch (error) {
    return next(error);
  }
}