import { EmailVerificationAlert } from "@/app/_components/_website/_controlpanals/_usercontrol/_Userprofile/EmailVerificationAlert";
import { ProfileForm } from "@/app/_components/_website/_controlpanals/_usercontrol/_Userprofile/ProfileForm";
import { ProfileHeader } from "@/app/_components/_website/_controlpanals/_usercontrol/_Userprofile/ProfileHeader";
import FetchData from "@/app/_helpers/FetchData";
import React from "react";

export default async function UserProfilePage() {
  const user = await FetchData(`/current-user`, false);

  if (!user) return;
  return (
    <div className="min-h-screen flex-1/2 bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="">
        <ProfileHeader />
        {/* Left Column - Profile Summary */}

        <EmailVerificationAlert
          isVerified={!!user.email_verified_at}
          email={user.email}
        />

        <div className="mt-8 w-full">
          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
