import app from '../app.js';
import dotenv from 'dotenv';
import connectDB from '../db/db.js';
import { v2 as cloudinary } from 'cloudinary';

// Initialize environment variables
dotenv.config({ path: './.env' });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Async function to start the serverless function
export default async (req, res) => {
  // Connect to DB on first request
  await connectDB();

  // Pass request to Express
  return app(req, res);
};