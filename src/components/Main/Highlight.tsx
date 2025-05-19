import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import MainTitle from "./MainTitle";

const YOUTUBE_PLAYLIST_ID = "PLuY-NTS_5IpxSLENcrLkC1_E7RuWldqXR";
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

interface YoutubeVideoType {
  etag: string;
  id: string;
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    liveBroadcastContent: string;
    publishedAt: string;
    thumbnails: {
      high: {
        height: number;
        url: string;
        width: number;
      };
    };
    title: string;
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
}

export default function Highlight() {
  const [videos, setVideos] = useState<YoutubeVideoType[]>([]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems`,
          {
            params: {
              part: "snippet",
              playlistId: YOUTUBE_PLAYLIST_ID,
              maxResults: 10,
              key: API_KEY,
            },
          }
        );
        setVideos(res.data.items);
      } catch (err) {
        console.error("YouTube API 호출 실패:", err);
      }
    };

    fetchPlaylist();
  }, []);

  if (videos.length === 0) {
    return (
      <div className="w-full py-8 relative px-12">
        <div className="md:px-12">
          <MainTitle title="하이라이트" color="#FF9500" white />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 relative px-12">
      <div className="md:px-12">
        <MainTitle title="하이라이트" color="#FF9500" white />
      </div>
      <div className="relative md:px-12 group">
        <div
          id="swiper-button-prev"
          className="absolute left-0 top-1/2 z-10 transform -translate-y-1/2 cursor-pointer text-white text-3xl opacity-0 group-hover:opacity-100 transition swiper-button-disabled:opacity-30 swiper-button-disabled:cursor-not-allowed"
        >
          &#10094;
        </div>
        <div
          id="swiper-button-next"
          className="absolute right-0 top-1/2 z-10 transform -translate-y-1/2 cursor-pointer text-white text-3xl opacity-0 group-hover:opacity-100 transition swiper-button-disabled:opacity-30 swiper-button-disabled:cursor-not-allowed"
        >
          &#10095;
        </div>
        <Swiper
          modules={[Navigation, A11y]}
          spaceBetween={20}
          slidesPerView={3}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          navigation={{
            prevEl: "#swiper-button-prev",
            nextEl: "#swiper-button-next",
          }}
        >
          {videos.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-md overflow-hidden shadow mt-10 dark:bg-gray-900">
                <a
                  href={`https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`}
                  target="_blank"
                >
                  <img
                    src={item.snippet.thumbnails.high.url}
                    alt={`Slide ${index + 1}`}
                    className="w-full min-h-[200px] object-cover max-h-[300px]"
                  />
                  <div className="p-4">
                    <p className="font-bold kbo-font-medium text-lg mb-2">
                      {item.snippet.title}
                    </p>
                  </div>
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
