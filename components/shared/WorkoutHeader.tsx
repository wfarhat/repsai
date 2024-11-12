import Image from "next/image";

interface WorkoutHeaderProps {
    accountId: string;
    authUserId: string;
    name: string;
    username: string;
    imgUrl: string;
    bio: string;
    joinDate: string;
}

function WorkoutHeader({
    accountId,
    authUserId,
    name,
    username,
    imgUrl,
    bio,
    joinDate,
}: WorkoutHeaderProps) {
    return (
        <section>
            <div className="user-card bg-dark-3 p-6 rounded-xl w-full max-w-2xl relative flex flex-col items-center">
                <div className="flex flex-col items-center mt-4">
                    <Image
                        src={imgUrl || "/default-avatar.png"} 
                        alt="User Avatar"
                        width={96}
                        height={96}
                        className="rounded-full"
                    />
                    <h2 className="head-text text-light-1 mt-4">{name}</h2>
                    <p className="text-light-3">@{username}</p>
                </div>
            </div>
            <div>
                <h2 className="head-text text-light-1 mt-4">Saved Workouts</h2>
            </div>
        </section>

    );
}

export default WorkoutHeader;
