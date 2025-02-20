export interface Show {
  id: string;
  title: string;
  description: string | null;
  duration: string;
  video_path: string;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduleItem {
  id: string;
  show_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
  show?: Show;
}

export interface CurrentShow {
  show: Show;
  startTime: string;
  endTime: string;
  nextShow?: {
    show: Show;
    startTime: string;
  };
}