import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// Middleware to verify JWT and admin role
function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// E-waste stats by item type
router.get('/stats/item-type', adminAuth, async (req, res) => {
  try {
    const stats = await EwasteReport.aggregate([
      { $group: { _id: '$itemType', total: { $sum: '$quantity' } } },
      { $sort: { total: -1 } },
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

// E-waste stats by region (using drop-off location address)
router.get('/stats/region', adminAuth, async (req, res) => {
  try {
    const stats = await EwasteReport.aggregate([
      {
        $lookup: {
          from: 'dropofflocations',
          localField: 'location.coordinates',
          foreignField: 'coordinates.coordinates',
          as: 'dropoff',
        },
      },
      { $unwind: '$dropoff' },
      { $group: { _id: '$dropoff.address', total: { $sum: '$quantity' } } },
      { $sort: { total: -1 } },
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

// E-waste stats by month
router.get('/stats/month', adminAuth, async (req, res) => {
  try {
    const stats = await EwasteReport.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$quantity' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch monthly stats', error: err.message });
  }
});

// List all users with search and pagination
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const query = search ? { $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ] } : {};
    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(query);
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});
// Top users by report count
router.get('/stats/top-users', adminAuth, async (req, res) => {
  try {
    const stats = await EwasteReport.aggregate([
      { $group: { _id: '$user', total: { $sum: '$quantity' } } },
      { $sort: { total: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: { total: 1, name: '$user.name', email: '$user.email' } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch top users', error: err.message });
  }
});
// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

// Update user role
router.patch('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'agent', 'recycler', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user role', error: err.message });
  }
});

export default router;