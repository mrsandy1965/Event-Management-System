import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const EventCard = ({ event, viewTimezone }) => {
  const { profiles, updateEvent, deleteEvent, fetchEventLogs } = useContext(AppContext);
  const [showEdit, setShowEdit] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  
  // Edit form state
  const [editData, setEditData] = useState({
    selectedProfiles: event.profiles?.map(p => p._id) || [],
    timezone: event.timezone || 'America/New_York',
    startDate: dayjs(event.startTime).format('YYYY-MM-DD'),
    startTime: dayjs(event.startTime).format('HH:mm'),
    endDate: dayjs(event.endTime).format('YYYY-MM-DD'),
    endTime: dayjs(event.endTime).format('HH:mm')
  });

  const timezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney'
  ];

  const formatTime = (date, tz) => {
    return dayjs(date).tz(tz).format('MMM DD, YYYY - hh:mm A');
  };

  const handleViewLogs = async () => {
    const eventLogs = await fetchEventLogs(event._id);
    setLogs(eventLogs);
    setShowLogs(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this event?')) {
      await deleteEvent(event._id);
      setShowEdit(false);
    }
  };

  const toggleProfile = (profileId) => {
    if (editData.selectedProfiles.includes(profileId)) {
      setEditData({
        ...editData,
        selectedProfiles: editData.selectedProfiles.filter(id => id !== profileId)
      });
    } else {
      setEditData({
        ...editData,
        selectedProfiles: [...editData.selectedProfiles, profileId]
      });
    }
  };

  const handleUpdate = async () => {
    if (editData.selectedProfiles.length === 0) {
      alert('Please select at least one profile');
      return;
    }

    const startDateTime = `${editData.startDate}T${editData.startTime}`;
    const endDateTime = `${editData.endDate}T${editData.endTime}`;

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      alert('End time must be after start time');
      return;
    }

    try {
      await updateEvent(event._id, {
        profiles: editData.selectedProfiles,
        timezone: editData.timezone,
        startTime: new Date(startDateTime).toISOString(),
        endTime: new Date(endDateTime).toISOString(),
        updatedBy: 'User'
      });
      setShowEdit(false);
      alert('Event updated successfully!');
    } catch (error) {
      alert('Failed to update event');
    }
  };

  return (
    <>
      <div className="event-card">
        <div className="event-profiles">
          👥 {event.profiles?.map(p => p.name).join(', ')}
        </div>
        
        <div className="event-time">
          📅 Start: {formatTime(event.startTime, viewTimezone)}
        </div>
        
        <div className="event-time">
          ⏰ End: {formatTime(event.endTime, viewTimezone)}
        </div>

        <div className="event-meta">
          Created: {formatTime(event.createdAt, viewTimezone)} | 
          Updated: {formatTime(event.updatedAt, viewTimezone)}
        </div>

        <div className="event-actions">
          <button className="btn btn-secondary btn-small" onClick={() => setShowEdit(true)}>
            ✏️ Edit
          </button>
          <button className="btn btn-secondary btn-small" onClick={handleViewLogs}>
            📋 View Logs
          </button>
        </div>
      </div>

      {showEdit && (
        <div className="modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Event</h3>
              <button className="modal-close" onClick={() => setShowEdit(false)}>×</button>
            </div>
            
            <div className="form-group">
              <label className="form-label">Profiles</label>
              <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.5rem' }}>
                {profiles.map(profile => (
                  <div
                    key={profile._id}
                    style={{ padding: '0.5rem', cursor: 'pointer', borderRadius: '0.25rem', background: editData.selectedProfiles.includes(profile._id) ? '#ede9fe' : 'transparent' }}
                    onClick={() => toggleProfile(profile._id)}
                  >
                    <input
                      type="checkbox"
                      checked={editData.selectedProfiles.includes(profile._id)}
                      onChange={() => {}}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {profile.name}
                  </div>
                ))}
              </div>
              <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                {editData.selectedProfiles.length} profile{editData.selectedProfiles.length !== 1 ? 's' : ''} selected
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Timezone</label>
              <select
                className="form-select"
                value={editData.timezone}
                onChange={(e) => setEditData({ ...editData, timezone: e.target.value })}
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Start Date & Time</label>
              <div className="datetime-row">
                <input
                  type="date"
                  className="form-input"
                  value={editData.startDate}
                  onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                />
                <input
                  type="time"
                  className="form-input"
                  value={editData.startTime}
                  onChange={(e) => setEditData({ ...editData, startTime: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">End Date & Time</label>
              <div className="datetime-row">
                <input
                  type="date"
                  className="form-input"
                  value={editData.endDate}
                  onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                />
                <input
                  type="time"
                  className="form-input"
                  value={editData.endTime}
                  onChange={(e) => setEditData({ ...editData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowEdit(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdate}>Update Event</button>
            </div>
          </div>
        </div>
      )}

      {showLogs && (
        <div className="modal-overlay" onClick={() => setShowLogs(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Event Update History</h3>
              <button className="modal-close" onClick={() => setShowLogs(false)}>×</button>
            </div>
            
            {logs.length === 0 ? (
              <p style={{textAlign: 'center', padding: '2rem', color: '#9ca3af'}}>
                No update history yet
              </p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="log-item">
                  <div className="log-time">
                    {formatTime(log.updatedAt, viewTimezone)}
                  </div>
                  <div className="log-change">
                    {Object.keys(log.changes.before).map(key => (
                      <div key={key}>
                        {key} changed
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
            
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowLogs(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;
