import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!uri) {
console.error('Missing MONGO_URI. Ensure .env is loaded before importing database.js');
process.exit(1);
}
const conn = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(`MongoDB Connected: ${conn.connection.host}`);
return conn;
};

export default connectDB;

