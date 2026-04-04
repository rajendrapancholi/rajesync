// db.ts
import mongoose from "mongoose";
import { ENV } from "./env";

const MONGODB_URI = ENV.MONGODB_URI;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1); 
  }
};

export default mongoose;
