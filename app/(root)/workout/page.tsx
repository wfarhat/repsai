import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchLatestWorkout } from "@/lib/actions/workout.actions"; 
import NewWorkoutProfile from "@/components/shared/NewWorkoutProfile";
import WorkoutCard from "@/components/shared/WorkoutCard";

async function ViewWorkoutPage() {
  const user = await currentUser();
  if (!user) return <p>User not authenticated</p>;

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return <p>User not found in the database</p>;

  const latestWorkout = await fetchLatestWorkout(userInfo._id);

  return (
    <div className="main-container p-6">
      <NewWorkoutProfile />

      <div className="workout-display mt-6">
        {latestWorkout ? (
          <WorkoutCard
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

export default ViewWorkoutPage;
