import AboutMainSections from "@/app/_components/_website/_about/AboutMainSections";
import VideoSection from "@/app/_components/_website/_about/VideoSection";
import FetchData from "@/app/_helpers/FetchData";
import React from "react";

export default async function AboutPage() {
  const data = await FetchData(`/details`, false);

  return (
    <>
      <VideoSection mainVideo={data.main_video} />
      <AboutMainSections data={data} />
    </>
  );
}
