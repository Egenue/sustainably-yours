import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    default: '',
  },
  aspects: {
    materials: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    packaging: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    carbonFootprint: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    laborPractices: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  // Reference to either Product or Business
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Ensure either productId or businessId is provided
ratingSchema.pre('validate', function (next) {
  if (!this.productId && !this.businessId) {
    return next(new Error('Either productId or businessId must be provided'));
  }
  if (this.productId && this.businessId) {
    return next(new Error('Cannot provide both productId and businessId'));
  }
  next();
});

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;

