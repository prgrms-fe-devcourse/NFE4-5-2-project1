import { useState } from 'react';

const videos = [
  '/videos/home1.mp4',
  '/videos/home2.mp4',
  '/videos/home3.mp4',
  '/videos/home4.mp4',
  '/videos/home5.mp4',
];

export default function useRandomVideo() {
  const [videoSrc] = useState(() => {
    const initial = videos[Math.floor(Math.random() * videos.length)];
    return initial;
  });

  return videoSrc;
}

// import { useEffect, useState } from 'react';

// const videos = [
//   '/videos/home1.mp4',
//   '/videos/home2.mp4',
//   '/videos/home3.mp4',
//   '/videos/home4.mp4',
//   '/videos/home5.mp4',
// ];

// export default function useRandomVideo() {
//   const [videoSrc, setVideoSrc] = useState(videos[0]);

//   useEffect(() => {
//     const changeVideo = videos[Math.floor(Math.random() * videos.length)];
//     setVideoSrc(changeVideo);
//   }, []);

//   return videoSrc;
// }
