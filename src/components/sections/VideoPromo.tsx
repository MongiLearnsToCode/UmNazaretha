import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import Button from '../ui/Button';

const promoVideos = [
  {
    title: "Welcome to umNazaretha",
    description: "Experience our digital ministry platform",
    url: "https://player.vimeo.com/video/824804225", // Example Vimeo video
    thumbnail: "https://images.unsplash.com/photo-1601142634808-38923eb7c560?auto=format&fit=crop&q=80"
  }
];

export default function VideoPromo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const currentVideo = promoVideos[0];

  return (
    <section className="py-20 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Channel Preview</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-sky-500 mx-auto" />
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-800">
          {!isPlaying && (
            <div className="absolute inset-0">
              <img
                src={currentVideo.thumbnail}
                alt={currentVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-white mb-4">{currentVideo.title}</h3>
                <p className="text-gray-300 mb-6">{currentVideo.description}</p>
                <Button
                  variant="primary"
                  size="lg"
                  icon={Play}
                  onClick={() => setIsPlaying(true)}
                >
                  Watch Preview
                </Button>
              </div>
            </div>
          )}

          {isPlaying && (
            <>
              <iframe
                src={`${currentVideo.url}?autoplay=1&muted=${isMuted ? 1 : 0}&background=1`}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={isPlaying ? Pause : Play}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={isMuted ? VolumeX : Volume2}
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? 'Unmute' : 'Mute'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}