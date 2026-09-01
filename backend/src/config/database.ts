import mongoose from "mongoose";

const DB_URI = process.env.MONGODB_URI as string;

const connectDb = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("⛔️ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDb;
