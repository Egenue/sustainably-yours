import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  sustainabilityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0,
  },
  certifications: {
    type: [String],
    default: [],
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// Update averageRating when ratings change
productSchema.methods.calculateAverageRating = async function () {
  const Rating = mongoose.model('Rating');
  const ratings = await Rating.find({ productId: this._id }).select('rating').lean();

  if (!ratings || ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = ratings.reduce((acc, r) => acc + (r.rating || 0), 0);
    // keep one decimal place
    this.averageRating = Math.round((sum / ratings.length) * 10) / 10;
  }

  // Save without triggering infinite hooks if any
  await this.save();
};

const Product = mongoose.model('Product', productSchema);

export default Product;

