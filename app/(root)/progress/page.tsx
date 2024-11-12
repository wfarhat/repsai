
import CalendarWithProgress from "@/components/shared/WorkoutCalendar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProgressPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
        return null;
    }

    return (
        <main className="mx-auto max-w-5xl p-10">
            <h1 className="text-center text-3xl font-bold text-gray-500 text-heading1-bold mb-6">Your Workout Calendar</h1>
            <div className="flex justify-center">
                <div className="w-full max-w-4xl p-6 bg-gray-100 shadow-lg rounded-lg">
                    <CalendarWithProgress userId={user.id} />
                </div>
            </div>
        </main>
    );
}
