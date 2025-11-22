import 'dotenv/config';
import express from 'express';
import connectDB from './config/database.js';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import businessesRoutes from './routes/businesses.js';
import productsRoutes from './routes/products.js';
import ratingsRoutes from './routes/ratings.js';

const app = express();
app.use(express.json());

// mount routers
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/ratings', ratingsRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();