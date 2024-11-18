import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import CreateWorkout from "@/components/forms/CreateWorkout";
import { fetchUser } from "@/lib/actions/user.actions";

async function Page() {

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");
    console.log("User:", user);
    console.log("User Info:", userInfo);
    return (
        <>
            <h1 className='head-text'>Generate Workout</h1>

            <CreateWorkout userId={userInfo._id} />
        </>
    );
}

export default Page;