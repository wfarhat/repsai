import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchWorkouts } from "@/lib/actions/workout.actions";
import WorkoutHeader from "@/components/workouts/WorkoutHeader";
import WorkoutCard from "@/components/workouts/WorkoutCard";
import WorkoutProfile from "@/components/workouts/WorkoutProfileDelete";
import { redirect } from "next/navigation";

async function SavedWorkoutPage() {
  const user = await currentUser();
  if (!user) return <p>User not authenticated</p>;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");



  const workouts = await fetchWorkouts(userInfo._id);

  return (
    <div className="main-container p-6">
      <WorkoutHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
        joinDate={new Date(userInfo.createdAt).toLocaleDateString()}
      />
      <div className="workouts-list mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {workouts.length > 0 ? (
          workouts.map((workout: any, index: number) => (
            <WorkoutCard
              key={workout._id}
              index={index}
              title={workout.title}
              date={workout.date}
              exercises={workout.exercises}
            />
          ))
        ) : (
          <p className="text-gray-400 mt-4">No saved workouts found.</p>
        )}
      </div>

      <div className="mt-6 block xl:hidden">
        <h3 className="text-center text-heading4-medium text-primary-500">
          Manage Workouts:
        </h3>
        <div className="text-center text-heading4-medium text-light-3">
          <WorkoutProfile />
        </div>
      </div>
    </div>
  );
}

export default SavedWorkoutPage;
