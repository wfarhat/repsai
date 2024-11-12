import mongoose from "mongoose";
let isConnected = false;

export const connectToDB = async () => {

    mongoose.set("strictQuery", true);

    if (!process.env.MONGODB_URL) return console.log("MONGODB not found");

    if (isConnected) return console.log("Already connected");
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log("Connected to my DB");

    } catch (error) {
        console.log(error);
    }
}