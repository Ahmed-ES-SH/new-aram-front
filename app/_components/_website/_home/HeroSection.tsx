import FetchData from "@/app/_helpers/FetchData";
import React from "react";
import HeroVideo from "./hero-video";
import HeroSlider from "./HeroSwiper";

export default async function HeroSection() {
  const data = await FetchData(`/active-hero-section`, false);

  const videoData = await FetchData(`/get-section/1?limit_number=3`, false);

  const slides = await FetchData("/active-slides", false);

  if (data != "slider") {
    return <HeroVideo data={videoData} />;
  }

  return <HeroSlider slides={slides} />;
}
