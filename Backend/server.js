import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes (keep them in /routes folder)
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import businessRoutes from './routes/businesses.js';
import ratingRoutes from './routes/ratings.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Middleware ===
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:7447' }));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Super simple & works!

// === API Routes (as simple as it gets) ===
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// === Catch-all for 404 ===
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
  });
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});