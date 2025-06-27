import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!); // set it up
        console.log("MongoDB successful connection");

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};