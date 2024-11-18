import Link from "next/link";
import Image from "next/image";

// Define the props for the EditWorkoutHeader component
interface EditWorkoutHeaderProps {
  workoutId: string; // Unique identifier for the workout
  title: string; // Title of the workout
  exercises: { name: string; sets: number; reps: number }[]; // List of exercises in the workout
}

// Component for displaying the header and details of a workout with an edit option
function EditWorkoutHeader({ workoutId, title, exercises }: EditWorkoutHeaderProps) {
  return (
    <div className="workout-card bg-dark-3 p-6 rounded-xl w-full max-w-2xl">
      {/* Link to navigate to the workout edit page */}
      <Link href={`/workout/edit/${workoutId}`}>
        <div className="absolute top-4 right-4 flex cursor-pointer gap-3 items-center bg-light-3 px-5 py-3">
          {/* Edit workout icon */}
          <Image src="/assets/edit.svg" alt="Edit Workout" width={20} height={20} />
          <p className="text-light-1 text-lg font-semibold">Edit</p>
        </div>
      </Link>

      {/* Display the workout title */}
      <h2 className="head-text text-light-1">{title}</h2>

      {/* Render the list of exercises */}
      <ul className="mt-4">
        {exercises.map((exercise, index) => (
          <li key={index} className="text-light-3">
            {exercise.name}: {exercise.sets} sets x {exercise.reps} reps
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EditWorkoutHeader;
