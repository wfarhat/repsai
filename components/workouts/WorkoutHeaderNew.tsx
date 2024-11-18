"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { fetchUserWorkouts, deleteWorkout } from "@/lib/actions/workout.actions";
import Image from "next/image";

const NewWorkoutProfile = () => {
    // Get the authenticated user using Clerk
    const { user: clerkUser } = useUser();
    const router = useRouter();

    // State for the current workout ID and loading status
    const [workoutId, setWorkoutId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch the user's workouts on component mount
    useEffect(() => {
        const getWorkoutId = async () => {
            if (!clerkUser) {
                setLoading(false);
                return;
            }

            try {
                // Fetch user's workouts and set the first workout ID
                const workouts = await fetchUserWorkouts(clerkUser.id);
                setWorkoutId(workouts[0] || null);
            } catch (error) {
                console.error("Error fetching workouts:", error);
            } finally {
                setLoading(false); 
            }
        };

        getWorkoutId();
    }, [clerkUser]);

    // Handle deleting the current workout
    const handleDeleteWorkout = async () => {
        if (!clerkUser || !workoutId) return;

        try {
            await deleteWorkout(clerkUser.id, workoutId); 
            setWorkoutId(null); 
            router.push(`/saved-workout`); 
        } catch (error) {
            console.error("Failed to delete workout:", error);
            alert("Failed to delete workout.");
        }
    };

    // Navigate to the workout edit page
    const handleEditWorkout = () => {
        if (workoutId) {
            router.push(`/workout/edit`);
        }
    };

    // Display loading state while data is being fetched
    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6 text-white">
            <h2 className="text-center text-green-500 text-xl font-bold mb-4">
                Your new workout has been saved!
            </h2>
            {workoutId ? (
                <div className="flex gap-4">
                    {/* Button for editing the workout */}
                    <button
                        onClick={handleEditWorkout}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded flex items-center gap-2"
                    >
                        <Image src="/assets/edit.svg" alt="Edit" width={24} height={24} />
                        <span>Edit Workout</span>
                    </button>

                    {/* Button for deleting the workout */}
                    <button
                        onClick={handleDeleteWorkout}
                        className="px-3 py-2 bg-gray-400 hover:bg-red-600 rounded flex items-center gap-2"
                    >
                        <Image src="/assets/delete.svg" alt="Delete" width={24} height={24} />
                        <span>Delete Workout</span>
                    </button>
                </div>
            ) : (
                // Message shown when no workouts are available
                <p>No workouts found for this user.</p>
            )}
        </div>
    );
};

export default NewWorkoutProfile;
