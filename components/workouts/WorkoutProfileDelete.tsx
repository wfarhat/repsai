"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchUserWorkouts, deleteWorkout } from "@/lib/actions/workout.actions";
import Image from "next/image";

const WorkoutProfile = () => {
    // Initialize router for navigation
    const router = useRouter();

    // Retrieve the currently authenticated user from Clerk
    const { user: clerkUser } = useUser();

    // State to store workout IDs
    const [workoutIds, setWorkoutIds] = useState<string[]>([]);

    // State to handle loading status
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the workout IDs when the component loads
        const getWorkoutIds = async () => {
            if (!clerkUser) {
                setLoading(false);
                return;
            }

            try {
                // Fetch workouts for the authenticated user
                const workouts = await fetchUserWorkouts(clerkUser.id);
                setWorkoutIds(workouts);
            } catch (error) {
                console.error("Error fetching workouts:", error);
            } finally {
                setLoading(false);
            }
        };

        getWorkoutIds();
    }, [clerkUser]);

    // Function to delete a specific workout
    const handleDeleteWorkout = async (workoutId: string) => {
        if (!clerkUser) return;

        try {
            // Delete the workout and update the state
            await deleteWorkout(clerkUser.id, workoutId);
            setWorkoutIds((prevIds) => prevIds.filter((id) => id !== workoutId));
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete workout:", error);
        }
    };

    // Show loading state while workouts are being fetched
    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            {workoutIds.length > 0 ? (
                <ul>
                    {workoutIds.map((workoutId, index) => (
                        <li
                            key={workoutId}
                            className="rounded bg-black flex items-center justify-between mt-2 p-2"
                        >
                            <span className="ml-3 mr-3">Workout #{index + 1}:</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDeleteWorkout(workoutId)}
                                    className="text-white px-2 py-1 rounded"
                                >
                                    <Image
                                        src="/assets/delete.svg"
                                        alt="Delete"
                                        width={24}
                                        height={24}
                                    />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No workouts found for this user.</p>
            )}
        </div>
    );
};

export default WorkoutProfile;
