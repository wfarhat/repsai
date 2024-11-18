"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { fetchUserWorkouts } from "@/lib/actions/workout.actions";
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
                // Fetch user's workouts and sort them by date (latest first)
                const workouts = await fetchUserWorkouts(clerkUser.id);
                const sortedWorkouts = workouts.sort(
                    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                setWorkoutId(sortedWorkouts[0] || null);
            } catch (error) {
                console.error("Error fetching workouts:", error);
            } finally {
                setLoading(false);
            }
        };

        getWorkoutId();
    }, [clerkUser]);

    // Navigate to the workout edit page
    const handleEditWorkout = () => {
        if (workoutId) {
            router.push(`/workout/edit`);
        }
    };

    // Navigate to the saved workout page
    const handleContinue = () => {
        router.push(`/saved-workout`);
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

                    {/* Button for continuing to the saved workout */}
                    <button
                        onClick={handleContinue}
                        className="px-3 py-2 bg-green-500 hover:bg-green-600 rounded flex items-center gap-2"
                    >
                        <Image src="/assets/favorites.png" alt="Continue" width={24} height={24} />
                        <span>Continue</span>
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
