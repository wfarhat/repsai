"use server";

import mongoose from "mongoose";
import Progress from "../models/progress.model";
import User from "../models/user.model"; 
import { connectToDB } from "../mongoose";

// Define interface for saving workout days
interface SaveWorkoutDaysParams {
  userId: string;
  year: number;
  month: number;
  days: number[];
}

// Retrieve the ObjectId for a given user by their userId
async function getUserObjectId(userId: string): Promise<mongoose.Types.ObjectId | null> {
  const user = await User.findOne({ id: userId }).select("_id");
  return user ? user._id : null;
}

// Fetch the workout days for a specific user, year, and month
export async function getWorkoutDays(userId: string, year: number, month: number): Promise<number[]> {
  try {
    await connectToDB(); 

    const userObjectId = await getUserObjectId(userId);
    if (!userObjectId) {
      throw new Error("User not found in the database");
    }

    // Retrieve the progress document for the given year and month
    const progress = await Progress.findOne({
      user: userObjectId,
      year,
      month,
    });

    return progress ? progress.days : []; 
  } catch (error: any) {
    throw new Error(`Failed to fetch workout days: ${error.message}`);
  }
}

// Save or update the workout days for a user in a specific month
export async function saveWorkoutDays({ userId, year, month, days }: SaveWorkoutDaysParams): Promise<void> {
  try {
    await connectToDB(); 

    const userObjectId = await getUserObjectId(userId);
    if (!userObjectId) {
      throw new Error("User not found in the database");
    }

    // Check if there is an existing progress document for the given month
    const existingProgress = await Progress.findOne({ user: userObjectId, year, month });

    // Calculate the difference in days count to update monthlyWorkoutDays
    const previousDaysCount = existingProgress ? existingProgress.days.length : 0;
    const newDaysCount = days.length;
    const daysDifference = newDaysCount - previousDaysCount;

    // Update or create the progress document for the month
    await Progress.findOneAndUpdate(
      { user: userObjectId, year, month },
      { $set: { days }, $inc: { monthlyWorkoutDays: daysDifference } },
      { upsert: true }
    );
  } catch (error: any) {
    throw new Error(`Failed to save workout days: ${error.message}`);
  }
}

// Calculate the total workout days for a user in a specific year
export async function getTotalWorkoutDaysForYear(userId: string, year: number): Promise<number> {
  try {
    await connectToDB(); 

    const userObjectId = await getUserObjectId(userId);
    if (!userObjectId) {
      throw new Error("User not found in the database");
    }

    // Retrieve all progress documents for the user in the given year
    const progressEntries = await Progress.find({ user: userObjectId, year });

    // Sum up the workout days from all months in the year
    const totalWorkoutDays = progressEntries.reduce((total, entry) => total + entry.days.length, 0);
    return totalWorkoutDays;
  } catch (error: any) {
    throw new Error(`Failed to fetch yearly workout days: ${error.message}`);
  }
}
