import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { redirect } from "next/navigation";

async function ProfilePage() {
  const user = await currentUser();
  if (!user) return <p>User not authenticated</p>;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");


  
  const joinDate = new Date(userInfo.createdAt).toLocaleDateString();

  return (
    <div className="main-container p-6">
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
        joinDate={joinDate}
      />
    </div>
  );
}

export default ProfilePage;
