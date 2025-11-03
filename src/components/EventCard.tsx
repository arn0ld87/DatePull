import React from 'react';
import type { CalendarEvent } from '../types';
import { getGoogleCalendarUrl, getOutlookCalendarUrl, getYahooCalendarUrl } from '../utils/calendarUtils';

interface EventCardProps {
  event: CalendarEvent;
}

// Custom Icons
const IconClock: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IconLocation: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const IconCalendar: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const IconRepeat: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m-5 2a9 9 0 0112.55-7.58l-2.05 2.05A5 5 0 007 12h5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 20v-5h-5m5 2a9 9 0 01-12.55 7.58l2.05-2.05A5 5 0 0017 12h-5" />
    </svg>
);

// Minimalist Calendar Service Icons
const IconGoogleCalendar: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
        <path d="M15 10H9.5V14H15" />
        <path d="M9.5 12H12.5" />
    </svg>
);

const IconOutlookCalendar: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <path d="M12 14v-1a2 2 0 0 1 2-2v0a2 2 0 0 1 2 2v1" />
      <path d="M12 14h4" />
    </svg>
);

const IconYahooCalendar: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M16 16l-4-4-4 4"></path>
        <path d="M12 8v4"></path>
        <path d="M13 16h-2"></path>
    </svg>
);


const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-brand-surface border border-brand-surface-light shadow-lg rounded-2xl overflow-hidden hover:border-brand-primary/50 transition-colors duration-300">
      <div className="p-5 md:p-6">
        <h3 className="font-bold text-xl text-brand-text-primary mb-4">{event.title}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-brand-text-primary">
          <div className="flex items-center space-x-3">
            <IconCalendar className="h-5 w-5 text-brand-primary flex-shrink-0" />
            <span className="text-sm">{new Date(event.date + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center space-x-3">
            <IconClock className="h-5 w-5 text-brand-primary flex-shrink-0" />
            <span className="text-sm">{event.start_time} - {event.end_time}</span>
          </div>
          {event.location && (
            <div className="flex items-center space-x-3">
              <IconLocation className="h-5 w-5 text-brand-primary flex-shrink-0" />
              <span className="text-sm">{event.location}</span>
            </div>
          )}
          {event.recurrence && (
             <div className="flex items-center space-x-3">
                <IconRepeat className="h-5 w-5 text-brand-primary flex-shrink-0" />
                <span className="text-sm font-mono bg-brand-surface-light text-brand-text-secondary px-2 py-1 rounded-md text-xs">{event.recurrence}</span>
            </div>
          )}
        </div>

        {event.notes && (
          <div className="mt-4 pt-4 border-t border-brand-surface-light">
            <p className="text-sm text-brand-text-secondary"><span className="font-semibold text-brand-text-primary">Notizen:</span> {event.notes}</p>
          </div>
        )}
      </div>
      <div className="px-5 py-3 bg-brand-surface-light/30">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-brand-text-secondary">Hinzufügen zu:</span>
                <div className="flex space-x-4">
                    <a href={getGoogleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" title="Zu Google Kalender hinzufügen" className="text-brand-text-secondary hover:text-brand-primary transition-colors">
                        <IconGoogleCalendar className="h-5 w-5" />
                    </a>
                    <a href={getOutlookCalendarUrl(event)} target="_blank" rel="noopener noreferrer" title="Zu Outlook Kalender hinzufügen" className="text-brand-text-secondary hover:text-brand-primary transition-colors">
                        <IconOutlookCalendar className="h-5 w-5" />
                    </a>
                    <a href={getYahooCalendarUrl(event)} target="_blank" rel="noopener noreferrer" title="Zu Yahoo Kalender hinzufügen" className="text-brand-text-secondary hover:text-brand-primary transition-colors">
                        <IconYahooCalendar className="h-5 w-5" />
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EventCard;