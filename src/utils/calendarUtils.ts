import type { CalendarEvent } from '../types';

// Helper to format date and time for calendar links
const formatDateTime = (date: string, time: string, format: 'google' | 'iso'): string => {
    if (format === 'google') {
        // YYYYMMDDTHHMMSS
        return `${date.replace(/-/g, '')}T${time.replace(/:/g, '')}00`;
    }
    // iso: YYYY-MM-DDTHH:MM:SS
    return `${date}T${time}:00`;
};

// Generate a unique ID for iCal events
const generateUid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }) + "@datepull.ai";
};

export const getGoogleCalendarUrl = (event: CalendarEvent): string => {
    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams({
        text: event.title,
        dates: `${formatDateTime(event.date, event.start_time, 'google')}/${formatDateTime(event.date, event.end_time, 'google')}`,
        details: event.notes,
        location: event.location,
        ctz: 'Europe/Berlin'
    });
    if (event.recurrence) {
        params.append('recur', `RRULE:${event.recurrence}`);
    }
    return `${baseUrl}&${params.toString()}`;
};

export const getOutlookCalendarUrl = (event: CalendarEvent): string => {
    const baseUrl = 'https://outlook.office.com/calendar/0/deeplink/compose?rru=addevent';
     const params = new URLSearchParams({
        subject: event.title,
        startdt: formatDateTime(event.date, event.start_time, 'iso'),
        enddt: formatDateTime(event.date, event.end_time, 'iso'),
        body: event.notes,
        location: event.location,
        path: '/calendar/action/compose'
    });
    return `${baseUrl}&${params.toString()}`;
};

export const getYahooCalendarUrl = (event: CalendarEvent): string => {
    const baseUrl = 'https://calendar.yahoo.com/?v=60&view=d&type=20';
    const params = new URLSearchParams({
        title: event.title,
        st: formatDateTime(event.date, event.start_time, 'google'), // Yahoo uses a format similar to google's
        et: formatDateTime(event.date, event.end_time, 'google'),
        desc: event.notes,
        in_loc: event.location
    });
    // Yahoo does not have a standard URL param for recurrence rules
    return `${baseUrl}&${params.toString()}`;
};

export const generateIcsContent = (events: CalendarEvent[]): string => {
    const cal = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//DatePullAI//Alexander Schneider//EN',
        'CALSCALE:GREGORIAN',
    ];

    const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

    events.forEach(event => {
        cal.push('BEGIN:VEVENT');
        cal.push(`UID:${generateUid()}`);
        cal.push(`DTSTAMP:${now}`);
        cal.push(`DTSTART;TZID=Europe/Berlin:${formatDateTime(event.date, event.start_time, 'google')}`);
        cal.push(`DTEND;TZID=Europe/Berlin:${formatDateTime(event.date, event.end_time, 'google')}`);
        if(event.recurrence) {
            cal.push(`RRULE:${event.recurrence}`);
        }
        cal.push(`SUMMARY:${event.title}`);
        if(event.location) cal.push(`LOCATION:${event.location}`);
        if(event.notes) cal.push(`DESCRIPTION:${event.notes.replace(/\n/g, '\\n')}`);
        cal.push('END:VEVENT');
    });

    cal.push('END:VCALENDAR');
    return cal.join('\r\n');
};
