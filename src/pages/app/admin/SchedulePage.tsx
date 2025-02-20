import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, AlertCircle, Clock, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Dialog from '../../../components/ui/Dialog';
import type { Show, ScheduleItem } from '../../../lib/types/database';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export default function SchedulePage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [useAutoStartTime, setUseAutoStartTime] = useState(false);
  const [clearingDay, setClearingDay] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState(false);

  const [formData, setFormData] = useState({
    show_id: '',
    day_of_week: 0,
    start_time: '07:00',
    end_time: '07:30',
    is_recurring: true
  });

  useEffect(() => {
    Promise.all([fetchShows(), fetchSchedule()]).finally(() => setLoading(false));
  }, [selectedDay]);

  async function fetchShows() {
    try {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .order('title');

      if (error) throw error;
      setShows(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shows');
    }
  }

  async function fetchSchedule() {
    try {
      const { data, error } = await supabase
        .from('schedule_items')
        .select(`
          *,
          show:shows(*)
        `)
        .eq('day_of_week', selectedDay)
        .order('start_time');

      if (error) throw error;
      setScheduleItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule');
    }
  }

  const handleClearSchedule = async () => {
    setClearingDay(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('schedule_items')
        .delete()
        .eq('day_of_week', selectedDay);

      if (error) throw error;
      
      setScheduleItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear schedule');
    } finally {
      setClearingDay(false);
      setShowClearDialog(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItemId) return;
    
    setDeletingItem(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('schedule_items')
        .delete()
        .eq('id', deletingItemId);

      if (error) throw error;
      await fetchSchedule();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete schedule item');
    } finally {
      setDeletingItem(false);
      setShowDeleteDialog(false);
      setDeletingItemId(null);
    }
  };

  const getLastScheduledTime = () => {
    if (scheduleItems.length === 0) return '07:00';
    const lastItem = scheduleItems[scheduleItems.length - 1];
    return lastItem.end_time.slice(0, 5);
  };

  const updateEndTime = (showId: string, startTime: string) => {
    const show = shows.find(s => s.id === showId);
    if (!show) return;

    // Parse the duration string (HH:MM:SS) into minutes
    const [hours, minutes] = show.duration.split(':').map(Number);
    const durationMinutes = (hours * 60) + minutes;

    // Parse the start time
    const [startHour, startMinute] = startTime.split(':').map(Number);
    
    // Calculate end time
    let endHour = startHour + Math.floor((startMinute + durationMinutes) / 60);
    let endMinute = (startMinute + durationMinutes) % 60;

    // Handle day overflow
    if (endHour >= 24) {
      endHour = 23;
      endMinute = 59;
    }

    // Format the end time
    const formattedEndHour = endHour.toString().padStart(2, '0');
    const formattedEndMinute = endMinute.toString().padStart(2, '0');

    setFormData(prev => ({
      ...prev,
      end_time: `${formattedEndHour}:${formattedEndMinute}`
    }));
  };

  const handleShowSelect = (showId: string) => {
    setFormData(prev => ({
      ...prev,
      show_id: showId
    }));

    if (useAutoStartTime) {
      const startTime = getLastScheduledTime();
      setFormData(prev => ({
        ...prev,
        start_time: startTime
      }));
      updateEndTime(showId, startTime);
    } else {
      updateEndTime(showId, formData.start_time);
    }
  };

  const handleStartTimeChange = (time: string) => {
    setFormData(prev => ({
      ...prev,
      start_time: time
    }));
    if (formData.show_id) {
      updateEndTime(formData.show_id, time);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing && editingSchedule) {
        const { error } = await supabase
          .from('schedule_items')
          .update(formData)
          .eq('id', editingSchedule.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('schedule_items')
          .insert([formData]);

        if (error) throw error;
      }

      setFormData({
        show_id: '',
        day_of_week: selectedDay,
        start_time: '07:00',
        end_time: '07:30',
        is_recurring: true
      });
      setIsEditing(false);
      setEditingSchedule(null);
      setUseAutoStartTime(false);
      fetchSchedule();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save schedule item');
    }
  };

  const handleEdit = (item: ScheduleItem) => {
    setIsEditing(true);
    setEditingSchedule(item);
    setFormData({
      show_id: item.show_id,
      day_of_week: item.day_of_week,
      start_time: item.start_time.slice(0, 5),
      end_time: item.end_time.slice(0, 5),
      is_recurring: item.is_recurring
    });
    setUseAutoStartTime(false);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Schedule</h1>
        {!isEditing && (
          <Button variant="primary" icon={Plus} onClick={() => setIsEditing(true)}>
            Add Schedule Item
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {DAYS_OF_WEEK.map((day, index) => (
          <button
            key={day}
            onClick={() => setSelectedDay(index)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedDay === index
                ? 'bg-emerald-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {(isEditing || scheduleItems.length === 0) && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {isEditing ? 'Edit Schedule Item' : 'Add Schedule Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Show
              </label>
              <select
                value={formData.show_id}
                onChange={(e) => handleShowSelect(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-md text-white focus:outline-none focus:border-emerald-500"
                required
              >
                <option value="" className="bg-gray-800">Select a show</option>
                {shows.map((show) => (
                  <option 
                    key={show.id} 
                    value={show.id}
                    className="bg-gray-800 text-white"
                  >
                    {show.title} ({show.duration})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useAutoStartTime"
                  checked={useAutoStartTime}
                  onChange={(e) => {
                    setUseAutoStartTime(e.target.checked);
                    if (e.target.checked) {
                      const startTime = getLastScheduledTime();
                      handleStartTimeChange(startTime);
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="useAutoStartTime" className="text-sm text-gray-300 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Start after last scheduled program
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    disabled={useAutoStartTime}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    disabled
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Auto-calculated based on show duration
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_recurring"
                checked={formData.is_recurring}
                onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="is_recurring" className="ml-2 text-sm text-gray-300">
                Recurring weekly
              </label>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" variant="primary">
                {isEditing ? 'Update Schedule' : 'Add to Schedule'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditingSchedule(null);
                  setUseAutoStartTime(false);
                  setFormData({
                    show_id: '',
                    day_of_week: selectedDay,
                    start_time: '07:00',
                    end_time: '07:30',
                    is_recurring: true
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {scheduleItems.length > 0 && !isEditing && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="secondary"
              icon={X}
              onClick={() => setShowClearDialog(true)}
              disabled={clearingDay}
            >
              {clearingDay ? 'Clearing...' : 'Clear Schedule'}
            </Button>
          </div>
          
          {scheduleItems.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {(item.show as Show).title}
                  </h3>
                  <p className="text-emerald-500">
                    {new Date(`2000-01-01T${item.start_time}`).toLocaleTimeString()} - 
                    {new Date(`2000-01-01T${item.end_time}`).toLocaleTimeString()}
                  </p>
                  {item.is_recurring && (
                    <p className="text-sm text-gray-400 mt-1">Recurring weekly</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Pencil}
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => {
                      setDeletingItemId(item.id);
                      setShowDeleteDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearSchedule}
        title="Clear Schedule"
        message={`Are you sure you want to clear all schedule items for ${DAYS_OF_WEEK[selectedDay]}?`}
        confirmText="Clear Schedule"
        loading={clearingDay}
      />

      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingItemId(null);
        }}
        onConfirm={handleDelete}
        title="Delete Schedule Item"
        message="Are you sure you want to delete this schedule item?"
        confirmText="Delete"
        loading={deletingItem}
      />
    </div>
  );
}