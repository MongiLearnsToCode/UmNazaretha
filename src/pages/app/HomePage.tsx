import React, { useEffect, useState } from 'react';
import { Play, Bell, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { getCurrentShow, getDailySchedule } from '../../lib/utils/schedule';
import type { CurrentShow, ScheduleItem } from '../../lib/types/database';

// Default thumbnail images for different types of content
const defaultThumbnails = {
  worship: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80',
  prayer: 'https://images.unsplash.com/photo-1507036066871-b7e8032b3dea?auto=format&fit=crop&q=80',
  teaching: 'https://images.unsplash.com/photo-1490127252417-7c393f993ee4?auto=format&fit=crop&q=80',
  youth: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1601142634808-38923eb7c560?auto=format&fit=crop&q=80'
};

export default function HomePage() {
  const navigate = useNavigate();
  const [currentShow, setCurrentShow] = useState<CurrentShow | null>(null);
  const [upcomingShows, setUpcomingShows] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [current, schedule] = await Promise.all([
          getCurrentShow(),
          getDailySchedule(new Date().getDay())
        ]);

        setCurrentShow(current);
        
        // Filter upcoming shows (after current time)
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
        
        const upcoming = schedule
          .filter(item => item.start_time > currentTime)
          .slice(0, 4); // Show next 4 upcoming programs
        
        setUpcomingShows(upcoming);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  const getThumbnail = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('worship')) return defaultThumbnails.worship;
    if (lowerTitle.includes('prayer')) return defaultThumbnails.prayer;
    if (lowerTitle.includes('teach') || lowerTitle.includes('study')) return defaultThumbnails.teaching;
    if (lowerTitle.includes('youth')) return defaultThumbnails.youth;
    return defaultThumbnails.default;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-gray-400">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Currently Playing */}
      {currentShow ? (
        <section className="relative h-[400px] rounded-2xl overflow-hidden">
          <img
            src={currentShow.show.thumbnail_url || getThumbnail(currentShow.show.title)}
            alt={currentShow.show.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <Clock className="h-5 w-5" />
              <p>Now Live</p>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{currentShow.show.title}</h1>
            {currentShow.show.description && (
              <p className="text-gray-200 mb-4 line-clamp-2">{currentShow.show.description}</p>
            )}
            <div className="flex space-x-4">
              <Button 
                variant="primary" 
                icon={Play}
                onClick={() => navigate('/dashboard/live')}
              >
                Watch Now
              </Button>
              <Button variant="secondary" icon={Bell}>Set Reminder</Button>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative h-[400px] rounded-2xl overflow-hidden bg-gray-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                We'll Be Right Back
              </h2>
              <p className="text-gray-400">
                Our next program will begin shortly. Thank you for your patience.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Programs */}
      {upcomingShows.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Coming Up Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingShows.map((item, index) => (
              <Card key={index} className="group">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={item.show.thumbnail_url || getThumbnail(item.show.title)}
                    alt={item.show.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-emerald-400 text-sm mb-1">
                      {new Date(`2000-01-01T${item.start_time}`).toLocaleTimeString()}
                    </p>
                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                      {item.show.title}
                    </h3>
                  </div>
                </div>
                <Button variant="secondary" icon={Bell} className="w-full">
                  Set Reminder
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}