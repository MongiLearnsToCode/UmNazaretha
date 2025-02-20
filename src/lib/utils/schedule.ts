import { supabase } from '../supabase';
import { Show, ScheduleItem, CurrentShow } from '../types/database';

export async function getCurrentShow(): Promise<CurrentShow | null> {
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
  const dayOfWeek = now.getDay();

  try {
    const { data: scheduleItems, error } = await supabase
      .from('schedule_items')
      .select(`
        *,
        show:shows(*)
      `)
      .eq('day_of_week', dayOfWeek)
      .lte('start_time', currentTime)
      .gte('end_time', currentTime);

    if (error) throw error;

    // If no current show is found, return null
    if (!scheduleItems || scheduleItems.length === 0) {
      return null;
    }

    // Get the current show (first match if multiple exist)
    const currentSchedule = scheduleItems[0];

    // Get next show
    const { data: nextScheduleItem } = await supabase
      .from('schedule_items')
      .select(`
        *,
        show:shows(*)
      `)
      .eq('day_of_week', dayOfWeek)
      .gt('start_time', currentTime)
      .order('start_time')
      .limit(1)
      .single();

    return {
      show: currentSchedule.show as Show,
      startTime: currentSchedule.start_time,
      endTime: currentSchedule.end_time,
      nextShow: nextScheduleItem ? {
        show: nextScheduleItem.show as Show,
        startTime: nextScheduleItem.start_time,
      } : undefined,
    };
  } catch (error) {
    console.error('Error fetching current show:', error);
    return null;
  }
}

export async function getDailySchedule(dayOfWeek: number): Promise<ScheduleItem[]> {
  try {
    const { data, error } = await supabase
      .from('schedule_items')
      .select(`
        *,
        show:shows(*)
      `)
      .eq('day_of_week', dayOfWeek)
      .order('start_time');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching daily schedule:', error);
    return [];
  }
}