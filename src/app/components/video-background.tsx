"use client"
import { useEffect, useRef } from "react"

  const VideoBackground = () => {
  const lightVideoRef = useRef<HTMLVideoElement>(null)
  const darkVideoRef = useRef<HTMLVideoElement>(null)
 
  useEffect(() => {
    const playbackSpeed = 0.86

    if (lightVideoRef.current) {
      lightVideoRef.current.playbackRate = playbackSpeed
    }

    if (darkVideoRef.current) {
      darkVideoRef.current.playbackRate = playbackSpeed
    }
  }, [])
  return (
<div className="fixed inset-0 -z-10 overflow-hidden">
  {/* 🌞 Light mode video */}
  <video
    ref={lightVideoRef}
    autoPlay
    muted
    loop
    playsInline
    className="block dark:hidden w-full h-full object-cover"
  >
    <source src="/bg-video2.mp4" type="video/mp4" />
  </video>

  {/* 🌚 Dark mode video */}
  <video
    ref={darkVideoRef}
    autoPlay
    muted
    loop
    playsInline
    className="hidden dark:block w-full h-full object-cover"
  >
    <source src="/bg-video1.mp4" type="video/mp4" />
  </video>
</div>

  );
};

export default VideoBackground;

