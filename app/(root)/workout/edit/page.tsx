import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchLatestWorkout } from "@/lib/actions/workout.actions";
import WorkoutCardEdit from "@/components/shared/WorkoutCardEdit";

async function EditWorkoutPage() {
  const user = await currentUser();
  if (!user) return <p className="text-white">User not authenticated</p>;

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return <p className="text-white">User not found in the database</p>;

  const latestWorkout = await fetchLatestWorkout(userInfo._id);

  return (
    <div className="main-container p-6 text-white">
      <h2 className="text-green-500 text-2xl font-bold mb-4">Edit Your New Workout</h2>
      <div className="workout-display mt-6">
        {latestWorkout ? (
          <WorkoutCardEdit
            key={latestWorkout._id}
            index={0}
            title={latestWorkout.title}
            date={latestWorkout.date}
            exercises={latestWorkout.exercises}
          />
        ) : (
          <p className="text-gray-400 mt-4">No recent workout found.</p>
        )}
      </div>
    </div>
  );
}

export default EditWorkoutPage;
