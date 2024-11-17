"use server";

import mongoose from "mongoose";
import User from "../models/user.model";
import Workout from "../models/workout.model";
import Progress from "../models/progress.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";

// Define parameters for creating a workout
interface WorkoutParams {
  title: string;
  description?: string;
  user: string;
  exercises?: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
  }[];
}

// Create a new workout and associate it with a user
export async function createWorkout({ title, description, user, exercises = [] }: WorkoutParams) {
  try {
    await connectToDB();

    // Create a new workout document
    const createdWorkout = await Workout.create({
      title,
      description,
      user,
      exercises,
    });

    // Associate the workout with the user
    await User.findByIdAndUpdate(user, {
      $push: { workouts: createdWorkout._id },
    });

    // Revalidate the user's workout path to reflect changes
    revalidatePath(`/workouts/${user}`);

    return createdWorkout;
  } catch (error: any) {
    throw new Error(`Error creating workout: ${error.message}`);
  }
}

// Fetch all workouts associated with a user
export const fetchWorkouts = async (userId: string) => {
  try {
    // Convert userId to an ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // Find and return workouts sorted by date
    return await Workout.find({ user: objectId }).sort({ date: 1 });
  } catch (error: any) {
    throw new Error(`Failed to fetch workouts: ${error.message}`);
  }
};

// Fetch workout IDs associated with a specific Clerk user
export async function fetchUserWorkouts(clerkUserId: string) {
  try {
    connectToDB();

    // Find the user and retrieve their workout IDs
    const user = await User.findOne({ id: clerkUserId }).select("workouts");

    if (!user) {
      throw new Error("User not found");
    }

    return user.workouts || [];
  } catch (error: any) {
    throw new Error(`Failed to fetch workouts: ${error.message}`);
  }
}

// Delete a specific workout and update the user's workout list
export async function deleteWorkout(clerkUserId: string, workoutId: string) {
  try {
    connectToDB();

    // Remove the workout ID from the user's workouts
    await User.updateOne(
      { id: clerkUserId },
      { $pull: { workouts: workoutId } }
    );

    // Delete the workout document from the database
    await Workout.deleteOne({ _id: workoutId });

    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to delete workout: ${error.message}`);
  }
}

// Fetch details of a specific workout
export async function fetchWorkoutDetails(workoutId: string) {
  try {
    connectToDB();

    // Find and return the workout details
    return await Workout.findById(workoutId);
  } catch (error: any) {
    throw new Error(`Failed to fetch workout details: ${error.message}`);
  }
}

// Fetch the latest workout for a user
export async function fetchLatestWorkout(userId: string) {
  try {
    await connectToDB();

    // Convert userId to an ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // Find and return the most recent workout
    const latestWorkout = await Workout.findOne({ user: objectId })
      .sort({ date: -1 })
      .limit(1);

    return latestWorkout;
  } catch (error: any) {
    throw new Error(`Failed to fetch latest workout: ${error.message}`);
  }
}

// Get the total number of workout days for a specific month
export async function getWorkoutDaysInMonth(userId: string, year: number, month: number) {
  await connectToDB();

  // Find progress for the specific user, year, and month
  const progress = await Progress.findOne({ user: userId, year, month });

  // Return the count of workout days
  return progress ? progress.days.length : 0;
}

// Get the total number of workout days for a specific year
export async function getWorkoutDaysInYear(userId: string, year: number) {
  await connectToDB();

  // Find progress for the specific user and year
  const yearlyProgress = await Progress.find({ user: userId, year });

  // Calculate and return the total workout days
  const totalDays = yearlyProgress.reduce((acc, month) => acc + month.days.length, 0);
  return totalDays;
}
