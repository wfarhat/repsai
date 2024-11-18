import Link from "next/link";
import Image from "next/image";

interface ProfileHeaderProps {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  joinDate: string;
}

function ProfileHeader({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  joinDate,
}: ProfileHeaderProps) {
  return (
    // Show the edit button if the authenticated user is viewing their own profile
    // Display the user profile image, name, username, bio, and join date

    <div className="user-card bg-dark-3 p-6 rounded-xl w-full max-w-2xl relative flex flex-col items-center">

      {accountId === authUserId && (
        <Link href="/profile/edit">
          <div className="absolute top-4 right-4 flex cursor-pointer gap-3 items-center rounded-lg bg-light-3 px-5 py-3">
            <Image
              src="/assets/edit.svg"
              alt="Edit Profile"
              width={20}
              height={20}
              className="svg-black"
            />
            <p className="text-light-1 text-lg font-semibold">Edit</p> 
          </div>
        </Link>
      )}

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
        <p className="text-light-1 mt-4 border border-gray-500 rounded p-3">
          {bio ? `Bio: ${bio}` : "No bio available"}
        </p> 
        <p className="text-light-3 mt-2">Join Date: {joinDate}</p>
      </div>
    </div>
  );
}

export default ProfileHeader;
