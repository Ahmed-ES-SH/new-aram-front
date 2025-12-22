import UserDropDown from "./_dropdowns/UserDropDown";
import ConversationsDropDown from "./_dropdowns/ConversationsDropDown";
import NotificationsDropDown from "./_dropdowns/NotificationsDropDown";
import LocaleLink from "../_website/_global/LocaleLink";
import MenuButton from "./_topbar/MenuButton";
import Img from "../_website/_global/Img";
import FetchData from "@/app/_helpers/FetchData";

export default async function Topbar() {
  const user = await FetchData(`/current-user`, false);

  const conversations = await FetchData(
    `/user/${user.id}/conversations`,
    false
  );
  const notifications =
    user &&
    (await FetchData(
      `/last-ten-notifications/${user.id}/${user.account_type}`,
      false
    ));

  return (
    <>
      <div className="w-full fixed top-0 left-0 z-99999 h-[70px] bg-fourth-dash shadow-md">
        <div className="w-[95%] h-full  mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MenuButton />

            <LocaleLink href="/" className="flex items-center justify-center">
              <Img className="w-[65px]" src="/logo.png" />
            </LocaleLink>
          </div>
          <div className="flex items-center gap-5 cursor-pointer">
            <UserDropDown />
            <ConversationsDropDown conversations={conversations} />
            <NotificationsDropDown notifications={notifications} />
          </div>
        </div>
      </div>
    </>
  );
}
