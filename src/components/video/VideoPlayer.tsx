import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import Button from '../ui/Button';
import { getBunnyStreamUrl } from '../../lib/bunny';

interface VideoPlayerProps {
  videoId: string;
  poster?: string;
  onEnded?: () => void;
  autoPlay?: boolean;
  startTime?: string; // HH:MM:SS format
}

export default function VideoPlayer({ 
  videoId, 
  poster, 
  onEnded, 
  autoPlay = true,
  startTime 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const syncIntervalRef = useRef<number>();

  // Calculate the time offset in seconds based on show start time
  const calculateTimeOffset = (startTimeStr: string): number => {
    const now = new Date();
    const [hours, minutes, seconds] = startTimeStr.split(':').map(Number);
    
    const startTime = new Date();
    startTime.setHours(hours, minutes, seconds);

    // Calculate the difference in seconds
    const diffInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    return Math.max(0, diffInSeconds); // Ensure we don't return negative values
  };

  // Sync playback position with real time
  const syncPlaybackPosition = () => {
    const video = videoRef.current;
    if (!video || !startTime) return;

    const targetPosition = calculateTimeOffset(startTime);
    const currentPosition = video.currentTime;
    const diff = Math.abs(targetPosition - currentPosition);

    // If we're more than 2 seconds out of sync, adjust the playback position
    if (diff > 2) {
      video.currentTime = targetPosition;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    const streamUrl = getBunnyStreamUrl(videoId);

    const initializePlayback = () => {
      if (startTime) {
        const offset = calculateTimeOffset(startTime);
        video.currentTime = offset;
      }

      if (autoPlay) {
        video.play().catch(() => {
          console.log('Autoplay prevented');
        });
      }

      // Start synchronization interval
      if (startTime) {
        syncIntervalRef.current = window.setInterval(syncPlaybackPosition, 5000);
      }
    };

    if (Hls.isSupported()) {
      hls = new Hls({
        startPosition: -1,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        enableWorker: true, // Enable web worker for better performance
        backBufferLength: 90 // Limit back buffer to 90 seconds
      });
      
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        initializePlayback();
      });

      // Handle live sync
      hls.on(Hls.Events.LEVEL_LOADED, (_, data) => {
        if (data.details.live) {
          const latency = hls.latency;
          if (latency > 30) {
            video.currentTime = video.duration - 10;
          }
        }
      });

      // Handle playback errors
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad(); // Try to recover from network error
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError(); // Try to recover from media error
              break;
            default:
              // Destroy and reinitialize for other fatal errors
              hls?.destroy();
              initializeHls();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', initializePlayback);
    }

    // Update playing state when video starts playing
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Handle seeking and buffering
    const handleSeeking = () => {
      if (startTime) {
        syncPlaybackPosition();
      }
    };

    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('waiting', handleSeeking);

    return () => {
      if (hls) {
        hls.destroy();
      }
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('waiting', handleSeeking);
      video.removeEventListener('loadedmetadata', initializePlayback);
    };
  }, [videoId, autoPlay, startTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      onEnded?.();
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [onEnded]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={poster}
        playsInline
        muted={isMuted}
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            icon={isPlaying ? Pause : Play}
            onClick={togglePlay}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={isMuted ? VolumeX : Volume2}
            onClick={toggleMute}
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </Button>
        </div>
      </div>
    </div>
  );
}