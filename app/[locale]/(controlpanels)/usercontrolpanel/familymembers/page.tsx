import FamilyMembersGrid from "@/app/_components/_website/_controlpanals/_usercontrol/_familyMembers/FamilyMembersGrid";
import UserHeader from "@/app/_components/_website/_controlpanals/_usercontrol/_familyMembers/UserHeader";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("metaFamilyMembers");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function FamilyMembersPage() {
  const currentUser = await FetchData("/current-user", false);
  const members = await FetchData(`/family-members`, false);

  return (
    <div className="p-2 w-full">
      <UserHeader user={currentUser} />
      <FamilyMembersGrid members={members} />
    </div>
  );
}
