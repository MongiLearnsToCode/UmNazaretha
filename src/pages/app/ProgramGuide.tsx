import React, { useState, useEffect } from 'react';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { getDailySchedule } from '../../lib/utils/schedule';
import type { ScheduleItem } from '../../lib/types/database';

export default function ProgramGuide() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      const items = await getDailySchedule(selectedDate.getDay());
      setScheduleItems(items);
      setLoading(false);
    };

    fetchSchedule();
  }, [selectedDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-gray-400">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Program Guide</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-white font-medium">
            {formatDate(selectedDate)}
          </span>
          <button
            onClick={() => changeDate(1)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {scheduleItems.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-400">No programs scheduled for this day.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {scheduleItems.map((item, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="text-emerald-400 font-medium">
                      {new Date(`2000-01-01T${item.start_time}`).toLocaleTimeString()}
                    </span>
                    <h3 className="text-lg font-medium text-white">
                      {item.show.title}
                    </h3>
                  </div>
                  {item.show.description && (
                    <p className="text-gray-400 mb-2">{item.show.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Duration: {item.show.duration}
                  </p>
                </div>
                <Button variant="secondary" icon={Bell}>
                  Set Reminder
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}