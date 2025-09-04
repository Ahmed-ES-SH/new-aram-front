import React from "react";

interface props {
  mainVideo: string;
}

export default function VideoSection({ mainVideo }: props) {
  const isYoutubeURL = mainVideo && mainVideo.includes("www.youtube.com");
  const videoId =
    (isYoutubeURL &&
      mainVideo &&
      mainVideo.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      )) ||
    "Not Find The VideoId";

  return (
    <>
      <div className="relative h-[100vh] mt-[75px] flex items-center justify-center w-full overflow-hidden">
        {/* فيديو الخلفية */}
        {!isYoutubeURL ? (
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={mainVideo ?? "/defaults/default-video.mp4"}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          // YouTube Video
          <iframe
            width="100%"
            height="240"
            src={`https://www.youtube.com/embed/${videoId[1]}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-md h-full"
          ></iframe>
        )}

        {/* طبقة سوداء شفافة فوق الفيديو */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
      </div>
    </>
  );
}
