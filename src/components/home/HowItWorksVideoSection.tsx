'use client';

import React, { useState, useRef } from 'react';
import {
  PlayIcon,
  PauseIcon,
  Volume2Icon,
  VolumeXIcon,
  RotateCcwIcon,
  MaximizeIcon,
  UsersIcon,
} from 'lucide-react';
import { WEBSITE_VIDEO_CONFIG } from '../../data/videoConfig';

export function HowItWorksVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(102); // fallback 102s (1:42)

  // Time formatting utility
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay policy or media loading fallback
            setIsPlaying(true);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (video.duration && !isNaN(video.duration)) {
      setDuration(video.duration);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video && !isNaN(video.duration)) {
      setDuration(video.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  const handleSkip = (deltaSeconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    const target = Math.max(0, Math.min(duration, video.currentTime + deltaSeconds));
    video.currentTime = target;
    setCurrentTime(target);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section
      id="how-it-works-video"
      aria-labelledby="video-heading"
      className="relative overflow-hidden border-b border-line bg-surface py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-medium text-brand">
            <UsersIcon className="h-3.5 w-3.5" />
            <span>How It Works</span>
          </div>
          <h2
            id="video-heading"
            className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl"
          >
            {WEBSITE_VIDEO_CONFIG.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-body">
            {WEBSITE_VIDEO_CONFIG.subtitle}
          </p>
        </div>

        {/* Clean Standard Video Player Render */}
        <div
          ref={containerRef}
          className="group relative mt-10 overflow-hidden rounded-3xl border border-line bg-black shadow-2xl"
        >
          {/* HTML5 Video Element */}
          <div className="relative aspect-video w-full bg-black">
            <video
              ref={videoRef}
              src={WEBSITE_VIDEO_CONFIG.videoUrl}
              poster={WEBSITE_VIDEO_CONFIG.posterUrl}
              playsInline
              preload="metadata"
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              onClick={handleTogglePlay}
              className="h-full w-full object-cover cursor-pointer"
            />

            {/* Dark Ambient Overlay with Big Center Play/Pause Button */}
            {!isPlaying && (
              <div
                onClick={handleTogglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity duration-300"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePlay();
                  }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-white shadow-2xl ring-4 ring-white/20 transition-transform duration-200 hover:scale-110 active:scale-95"
                  aria-label="Play video"
                >
                  <PlayIcon className="h-8 w-8 fill-current ml-1" />
                </button>
              </div>
            )}

            {/* Bottom YouTube-Style Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4">
              {/* Scrubber Range Input */}
              <div className="relative mb-3 flex items-center">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/30">
                  <div
                    className="h-full bg-red-500 transition-all duration-75 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Video timeline scrubber"
                  className="absolute inset-0 h-4 w-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  {/* Play / Pause Toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlay();
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <PauseIcon className="h-4 w-4 fill-current" />
                    ) : (
                      <PlayIcon className="h-4 w-4 fill-current ml-0.5" />
                    )}
                  </button>

                  {/* 10s Rewind */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSkip(-10);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                    title="Rewind 10 seconds"
                    aria-label="Rewind 10 seconds"
                  >
                    <RotateCcwIcon className="h-4 w-4" />
                  </button>

                  {/* 10s Fast-Forward */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSkip(10);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                    title="Forward 10 seconds"
                    aria-label="Forward 10 seconds"
                  >
                    <RotateCcwIcon className="h-4 w-4 scale-x-[-1]" />
                  </button>

                  {/* Mute / Unmute */}
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeXIcon className="h-4 w-4" /> : <Volume2Icon className="h-4 w-4" />}
                  </button>

                  {/* Timecode */}
                  <span className="text-xs font-medium text-neutral-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Fullscreen Button */}
                  <button
                    type="button"
                    onClick={handleFullscreen}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Fullscreen"
                  >
                    <MaximizeIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
