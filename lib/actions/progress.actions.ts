"use server";

import mongoose from "mongoose";
import Progress from "../models/progress";
import User from "../models/user.model"; 
import { connectToDB } from "../mongoose";

interface SaveWorkoutDaysParams {
  userId: string;
  year: number;
  month: number;
  days: number[];
}

async function getUserObjectId(userId: string): Promise<mongoose.Types.ObjectId | null> {
  const user = await User.findOne({ id: userId }).select("_id");
  return user ? user._id : null;
}

export async function getWorkoutDays(userId: string, year: number, month: number): Promise<number[]> {
  try {
    await connectToDB();

    const userObjectId = await getUserObjectId(userId);
    if (!userObjectId) {
      throw new Error("User not found in the database");
    }

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

export async function saveWorkoutDays({ userId, year, month, days }: SaveWorkoutDaysParams): Promise<void> {
  try {
    await connectToDB();

    const userObjectId = await getUserObjectId(userId);
    if (!userObjectId) {
      throw new Error("User not found in the database");
    }

    await Progress.findOneAndUpdate(
      { user: userObjectId, year, month },
      { $set: { days } },
      { upsert: true }
    );
  } catch (error: any) {
    throw new Error(`Failed to save workout days: ${error.message}`);
  }
}
