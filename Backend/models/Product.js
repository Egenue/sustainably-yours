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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update averageRating when ratings change
productSchema.methods.calculateAverageRating = async function () {
  const Rating = mongoose.model('Rating');
  const ratings = await Rating.find({ productId: this._id });
  
  if (ratings.length === 0) {
    this.averageRating = 0;
    return;
  }
  
  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  this.averageRating = Math.round((sum / ratings.length) * 10) / 10;
  await this.save();
};

const Product = mongoose.model('Product', productSchema);

export default Product;

