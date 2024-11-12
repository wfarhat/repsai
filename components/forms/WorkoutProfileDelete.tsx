"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchUserWorkouts, deleteWorkout } from "@/lib/actions/workout.actions";
import Image from "next/image";

const WorkoutProfile = () => {
    const router = useRouter();
    const { user: clerkUser } = useUser();
    const [workoutIds, setWorkoutIds] = useState<string[]>([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getWorkoutIds = async () => {
            if (!clerkUser) {
                setLoading(false);
                return;
            }

            try {
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

    const handleDeleteWorkout = async (workoutId: string) => {
        if (!clerkUser) return;

        try {
            await deleteWorkout(clerkUser.id, workoutId);
            setWorkoutIds((prevIds) => prevIds.filter((id) => id !== workoutId));
            window.location.reload(); 

        } catch (error) {
            console.error("Failed to delete workout:", error);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            {workoutIds.length > 0 ? (
                <ul>
                    {workoutIds.map((workoutId, index) => (
                        <li key={workoutId} className="rounded bg-black flex items-center justify-between mt-2 p-2">
                            <span className="ml-3 mr-3">Workout #{index + 1}:</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleDeleteWorkout(workoutId)} className="text-white px-2 py-1 rounded">
                                    <Image src="/assets/delete.svg" alt="Delete" width={24} height={24} />
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
