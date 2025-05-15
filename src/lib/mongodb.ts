import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if(!MONGODB_URI) throw new Error("Missing 'MONGODB_URI'");

export const connectDB = async () => {

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
}