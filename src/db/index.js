import mongoose from "mongoose";

const connectDB = async (URI, DB_NAME) => {
  try {
    const response = await mongoose.connect(`${URI}/${DB_NAME}`);
    console.log("MongoDB Connected successfully");
  } catch (error) {
    throw new Error("Error establishing connection with database");
  }
};
export default connectDB;
