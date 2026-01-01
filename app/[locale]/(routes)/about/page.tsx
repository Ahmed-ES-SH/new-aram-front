import AboutMainSections from "@/app/_components/_website/_about/AboutMainSections";
import VideoSection from "@/app/_components/_website/_about/VideoSection";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("metaAboutPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function AboutPage() {
  const data = await FetchData(`/details`, false);
  const video = await FetchData(`/get-video?video_id=about_video`, false);

  return (
    <div className="overflow-hidden mt-14">
      <VideoSection
        mainVideo={video ? video?.video_url : "/videos/background.mp4"}
      />
      <AboutMainSections data={data ?? {}} />
    </div>
  );
}
