import express from 'express';
import { body, validationResult } from 'express-validator';
import Rating from '../models/Rating.js';
import Product from '../models/Product.js';
import Business from '../models/Business.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/ratings
// @desc    Create a new rating
// @access  Private
router.post(
  '/',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('productId').optional().isMongoId().withMessage('Invalid product ID'),
    body('businessId').optional().isMongoId().withMessage('Invalid business ID'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { rating, comment, productId, businessId, aspects } = req.body;

      // Validate that either productId or businessId is provided
      if (!productId && !businessId) {
        return res.status(400).json({ message: 'Either productId or businessId must be provided' });
      }

      // Check if product/business exists
      if (productId) {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
      }

      if (businessId) {
        const business = await Business.findById(businessId);
        if (!business) {
          return res.status(404).json({ message: 'Business not found' });
        }
      }

      // Check if user already rated this product/business
      const existingRating = await Rating.findOne({
        userId: req.user._id,
        ...(productId ? { productId } : { businessId }),
      });

      if (existingRating) {
        return res.status(400).json({ message: 'You have already rated this item' });
      }

      // Create rating
      const newRating = await Rating.create({
        userId: req.user._id,
        userName: req.user.name,
        rating,
        comment: comment || '',
        aspects: aspects || {
          materials: rating,
          packaging: rating,
          carbonFootprint: rating,
          laborPractices: rating,
        },
        productId: productId || null,
        businessId: businessId || null,
      });

      // Update product/business with new rating
      if (productId) {
        const product = await Product.findById(productId);
        product.ratings.push(newRating._id);
        await product.save();
        await product.calculateAverageRating();
      }

      if (businessId) {
        const business = await Business.findById(businessId);
        business.ratings.push(newRating._id);
        await business.save();
        await business.calculateAverageRating();
      }

      // Populate user info
      await newRating.populate('userId', 'name email');

      res.status(201).json(newRating);
    } catch (error) {
      console.error('Create rating error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/ratings/product/:productId
// @desc    Get all ratings for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const ratings = await Rating.find({ productId: req.params.productId })
      .populate('userId', 'name email')
      .sort({ date: -1 });

    res.json(ratings);
  } catch (error) {
    console.error('Get product ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ratings/business/:businessId
// @desc    Get all ratings for a business
// @access  Public
router.get('/business/:businessId', async (req, res) => {
  try {
    const ratings = await Rating.find({ businessId: req.params.businessId })
      .populate('userId', 'name email')
      .sort({ date: -1 });

    res.json(ratings);
  } catch (error) {
    console.error('Get business ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/ratings/:id
// @desc    Update a rating
// @access  Private (Owner only)
router.put(
  '/:id',
  protect,
  [
    body('rating').optional().isInt({ min: 1, max: 5 }),
  ],
  async (req, res) => {
    try {
      const rating = await Rating.findById(req.params.id);

      if (!rating) {
        return res.status(404).json({ message: 'Rating not found' });
      }

      // Check if user is the owner
      if (rating.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this rating' });
      }

      const updatedRating = await Rating.findByIdAndUpdate(
        req.params.id,
        { ...req.body, date: new Date() },
        { new: true, runValidators: true }
      ).populate('userId', 'name email');

      // Recalculate average rating for product/business
      if (updatedRating.productId) {
        const product = await Product.findById(updatedRating.productId);
        await product.calculateAverageRating();
      }

      if (updatedRating.businessId) {
        const business = await Business.findById(updatedRating.businessId);
        await business.calculateAverageRating();
      }

      res.json(updatedRating);
    } catch (error) {
      console.error('Update rating error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/ratings/:id
// @desc    Delete a rating
// @access  Private (Owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Check if user is the owner
    if (rating.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this rating' });
    }

    const productId = rating.productId;
    const businessId = rating.businessId;

    await Rating.findByIdAndDelete(req.params.id);

    // Recalculate average rating
    if (productId) {
      const product = await Product.findById(productId);
      if (product) {
        product.ratings = product.ratings.filter(r => r.toString() !== req.params.id);
        await product.save();
        await product.calculateAverageRating();
      }
    }

    if (businessId) {
      const business = await Business.findById(businessId);
      if (business) {
        business.ratings = business.ratings.filter(r => r.toString() !== req.params.id);
        await business.save();
        await business.calculateAverageRating();
      }
    }

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

