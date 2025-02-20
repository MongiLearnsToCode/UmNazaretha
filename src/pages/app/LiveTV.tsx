import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import Button from '../../components/ui/Button';
import VideoPlayer from '../../components/video/VideoPlayer';
import { getCurrentShow } from '../../lib/utils/schedule';
import type { CurrentShow } from '../../lib/types/database';

export default function LiveTV() {
  const [currentShow, setCurrentShow] = useState<CurrentShow | null>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    const fetchCurrentShow = async () => {
      const show = await getCurrentShow();
      if (show) {
        setCurrentShow(show);
        setShowPlaceholder(false);
      } else {
        setShowPlaceholder(true);
      }
    };

    fetchCurrentShow();
    const interval = setInterval(fetchCurrentShow, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleShowEnded = () => {
    // Refresh current show when the video ends
    getCurrentShow().then(show => {
      if (show) {
        setCurrentShow(show);
        setShowPlaceholder(false);
      } else {
        setShowPlaceholder(true);
      }
    });
  };

  return (
    <div className="space-y-6">
      {currentShow ? (
        <>
          <VideoPlayer
            videoId={currentShow.show.video_path}
            poster={currentShow.show.thumbnail_url || undefined}
            onEnded={handleShowEnded}
            autoPlay={true}
            startTime={currentShow.startTime}
          />

          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {currentShow.show.title}
                </h1>
                <p className="text-emerald-400">
                  Live Now • {new Date(`2000-01-01T${currentShow.startTime}`).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <p className="text-gray-300">{currentShow.show.description}</p>
          </div>
        </>
      ) : showPlaceholder ? (
        <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              We'll Be Right Back
            </h2>
            <p className="text-gray-400">
              Our next program will begin shortly. Thank you for your patience.
            </p>
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      )}

      {currentShow?.nextShow && (
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Up Next</h2>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h3 className="font-medium text-white">{currentShow.nextShow.show.title}</h3>
              <p className="text-sm text-gray-400">
                {new Date(`2000-01-01T${currentShow.nextShow.startTime}`).toLocaleTimeString()}
              </p>
            </div>
            <Button variant="secondary" icon={Bell} size="sm">
              Remind Me
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}