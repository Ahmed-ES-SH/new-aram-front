import React from "react";

interface props {
  mainVideo: string;
}

export default function VideoSection({ mainVideo }: props) {
  // تحسين التعرف على روابط YouTube بأنواعها المختلفة
  const isYoutubeURL =
    mainVideo &&
    (mainVideo.includes("youtube.com") ||
      mainVideo.includes("youtu.be") ||
      mainVideo.includes("youtube-nocookie.com"));

  // دالة محسنة لاستخراج videoId من جميع أنواع روابط YouTube
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;

    // التعامل مع روابط youtu.be
    if (url.includes("youtu.be/")) {
      const match = url.match(/youtu\.be\/([^&?\s]+)/);
      return match ? match[1].split("?")[0] : null;
    }

    // التعامل مع روابط youtube.com
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = isYoutubeURL ? getYouTubeVideoId(mainVideo) : null;

  return (
    <>
      <div className="relative h-[100vh] mt-[75px] flex items-center justify-center w-full overflow-hidden">
        {/* فيديو الخلفية */}
        {!isYoutubeURL || !videoId ? (
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={mainVideo ?? "/defaults/default-video.mp4"}
            autoPlay
            loop
            muted
            playsInline
            // إزالة عناصر التحكم
            controls={false}
          />
        ) : (
          // YouTube Video بدون عناصر تحكم
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&disablekb=1&fs=0&showinfo=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={false}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ border: "none" }}
          ></iframe>
        )}

        {/* طبقة سوداء شفافة فوق الفيديو */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
      </div>
    </>
  );
}
