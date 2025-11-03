import React from 'react';
import type { CalendarEvent } from '../types';
import EventCard from './EventCard';

interface EventListProps {
  events: CalendarEvent[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
};

export default EventList;