"use server";

import mongoose from "mongoose";
import User from "../models/user.model";
import Workout from "../models/workout.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import Progress from "../models/progress";

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

export async function createWorkout({ title, description, user, exercises = [] }: WorkoutParams) {
  try {
    await connectToDB();

    const createdWorkout = await Workout.create({
      title,
      description,
      user,
      exercises,
    })
    
    
    ;

    await User.findByIdAndUpdate(user, {
      $push: { workouts: createdWorkout._id }
    });

    revalidatePath(`/workouts/${user}`);

    return createdWorkout;

  } catch (error: any) {
    throw new Error(`Error creating workout: ${error.message}`);
  }
}

export const fetchWorkouts = async (userId: string) => {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    return await Workout.find({ user: objectId }).sort({ date: 1 });
  } catch (error: any) {
    throw new Error(`Failed to fetch workouts: ${error.message}`);
  }
};



export async function fetchUserWorkouts(clerkUserId: string) {
  try {
    connectToDB();

    const user = await User.findOne({ id: clerkUserId }).select("workouts");

    if (!user) {
      throw new Error("User not found");
    }

    return user.workouts || [];
  } catch (error: any) {
    throw new Error(`Failed to fetch workouts: ${error.message}`);
  }
}


export async function deleteWorkout(clerkUserId: string, workoutId: string) {
  try {
    connectToDB();

    await User.updateOne(
      { id: clerkUserId },
      { $pull: { workouts: workoutId } }
    );

    await Workout.deleteOne({ _id: workoutId });

    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to delete workout: ${error.message}`);
  }
}
export async function fetchWorkoutDetails(workoutId: string) {
  try {
    connectToDB();

    return await Workout.findById(workoutId);
  } catch (error: any) {
    throw new Error(`Failed to fetch workout details: ${error.message}`);
  }
}
export async function fetchLatestWorkout(userId: string) {
  try {
      await connectToDB();
      
      const objectId = new mongoose.Types.ObjectId(userId);
      
      const latestWorkout = await Workout.findOne({ user: objectId })
          .sort({ date: -1 })
          .limit(1);

      return latestWorkout;
  } catch (error: any) {
      throw new Error(`Failed to fetch latest workout: ${error.message}`);
  }
}


export async function getWorkoutDaysInMonth(userId: string, year: number, month: number) {
  await connectToDB();

  const progress = await Progress.findOne({ user: userId, year, month });
  return progress ? progress.days.length : 0;
}

export async function getWorkoutDaysInYear(userId: string, year: number) {
  await connectToDB();

  const yearlyProgress = await Progress.find({ user: userId, year });
  const totalDays = yearlyProgress.reduce((acc, month) => acc + month.days.length, 0);
  return totalDays;
}
