
export interface CalendarEvent {
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  notes: string;
  recurrence: string; // RRULE format
  attendees: string[];
  all_day: boolean;
  calendar_id?: string;
}

export interface GeminiResponse {
  events: CalendarEvent[];
}
