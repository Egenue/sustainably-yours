import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a business name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  logo: {
    type: String,
    default: '',
  },
  sustainabilityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  categories: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true,
  },
  website: {
    type: String,
    trim: true,
    default: '',
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
businessSchema.methods.calculateAverageRating = async function () {
  const Rating = mongoose.model('Rating');
  const ratings = await Rating.find({ businessId: this._id });
  
  if (ratings.length === 0) {
    this.averageRating = 0;
    return;
  }
  
  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  this.averageRating = Math.round((sum / ratings.length) * 10) / 10;
  await this.save();
};

const Business = mongoose.model('Business', businessSchema);

export default Business;

