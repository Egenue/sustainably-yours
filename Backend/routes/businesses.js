import express from 'express';
import { body, validationResult } from 'express-validator';
import Business from '../models/Business.js';
import Rating from '../models/Rating.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (category) {
      query.categories = { $in: [category] };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const businesses = await Business.find(query)
      .populate('ratings', 'rating comment userName date')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Business.countDocuments(query);

    res.json({
      businesses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate({
        path: 'ratings',
        populate: {
          path: 'userId',
          select: 'name email',
        },
      });

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.json(business);
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/businesses
// @desc    Create a new business
// @access  Private (Seller only)
router.post(
  '/',
  protect,
  upload.single('logo'),
  [
    body('name').trim().notEmpty().withMessage('Business name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('sustainabilityScore').optional().isInt({ min: 0, max: 100 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Only sellers can create businesses' });
      }

      const businessData = {
        ...req.body,
        logo: req.file ? `/uploads/${req.file.filename}` : req.body.logo || '',
        createdBy: req.user._id,
      };

      // Parse categories if it's a string
      if (typeof businessData.categories === 'string') {
        businessData.categories = businessData.categories.split(',').map(c => c.trim());
      }

      const business = await Business.create(businessData);

      res.status(201).json(business);
    } catch (error) {
      console.error('Create business error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/businesses/:id
// @desc    Update a business
// @access  Private (Seller only - owner)
router.put(
  '/:id',
  protect,
  upload.single('logo'),
  async (req, res) => {
    try {
      const business = await Business.findById(req.params.id);

      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }

      // Check if user is the creator
      if (business.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this business' });
      }

      const updateData = { ...req.body };
      if (req.file) {
        updateData.logo = `/uploads/${req.file.filename}`;
      }
      if (typeof updateData.categories === 'string') {
        updateData.categories = updateData.categories.split(',').map(c => c.trim());
      }
      updateData.updatedAt = new Date();

      const updatedBusiness = await Business.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json(updatedBusiness);
    } catch (error) {
      console.error('Update business error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/businesses/:id
// @desc    Delete a business
// @access  Private (Seller only - owner)
router.delete('/:id', protect, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Check if user is the creator
    if (business.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this business' });
    }

    // Delete all ratings for this business
    await Rating.deleteMany({ businessId: req.params.id });

    await Business.findByIdAndDelete(req.params.id);

    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Delete business error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

