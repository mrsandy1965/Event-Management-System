import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import EventCard from './EventCard';

const EventsList = () => {
  const { events, selectedProfile, loading } = useContext(AppContext);
  const [viewTimezone, setViewTimezone] = useState('America/New_York');

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Kolkata',
    'Australia/Sydney'
  ];

  // Update view timezone when selected profile changes
  useEffect(() => {
    if (selectedProfile?.timezone) {
      setViewTimezone(selectedProfile.timezone);
    }
  }, [selectedProfile]);

  return (
    <div className="card">
      <div className="events-header">
        <h2>Events</h2>
        <div className="form-group">
          <label className="form-label">View in Timezone</label>
          <select
            className="form-select"
            value={viewTimezone}
            onChange={(e) => setViewTimezone(e.target.value)}
          >
            {timezones.map(tz => (
              <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="empty-state">No events found</div>
      ) : (
        <div className="events-list">
          {events.map(event => (
            <EventCard key={event._id} event={event} viewTimezone={viewTimezone} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;
