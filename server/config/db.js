import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected:');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
};

export { connectDB, closeDB };