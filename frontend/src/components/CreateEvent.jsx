import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import dayjs from 'dayjs';

const CreateEvent = () => {
  const { profiles, selectedProfile, createEvent } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState('America/New_York');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('09:00');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProfiles = profiles.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProfile = (profile) => {
    if (selectedProfiles.find(p => p._id === profile._id)) {
      setSelectedProfiles(selectedProfiles.filter(p => p._id !== profile._id));
    } else {
      setSelectedProfiles([...selectedProfiles, profile]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Please enter an event title');
      return;
    }

    if (selectedProfiles.length === 0) {
      alert('Please select at least one profile');
      return;
    }
    
    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }

    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      alert('End time must be after start time');
      return;
    }

    try {
      await createEvent({
        title: title.trim(),
        profiles: selectedProfiles.map(p => p._id),
        timezone,
        startTime: new Date(startDateTime).toISOString(),
        endTime: new Date(endDateTime).toISOString()
      });

      // Reset form
      setTitle('');
      setSelectedProfiles([]);
      setStartDate('');
      setEndDate('');
      alert('Event created successfully!');
    } catch (error) {
      alert('Failed to create event');
    }
  };

  return (
    <div className="card">
      <h2>Create Event</h2>

      <div className="form-group">
        <label className="form-label">Event Title *</label>
        <input
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Profiles</label>
        <div className="multi-select">
          <div
            className="multi-select-trigger"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            {selectedProfiles.length === 0
              ? 'Select profiles...'
              : `${selectedProfiles.length} profile${selectedProfiles.length > 1 ? 's' : ''} selected`}
          </div>

          {showProfileDropdown && (
            <div className="multi-select-dropdown">
              <div className="multi-select-search">
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {filteredProfiles.map(profile => (
                <div
                  key={profile._id}
                  className={`multi-select-item ${selectedProfiles.find(p => p._id === profile._id) ? 'selected' : ''}`}
                  onClick={() => toggleProfile(profile)}
                >
                  <input
                    type="checkbox"
                    checked={!!selectedProfiles.find(p => p._id === profile._id)}
                    onChange={() => {}}
                  />
                  <span>{profile.name}</span>
                </div>
              ))}

              <button className="add-profile-btn" onClick={() => alert('Create profile in the header dropdown')}>
                + Add Profile
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Timezone</label>
        <select
          className="form-select"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
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
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="time"
            className="form-input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">End Date & Time</label>
        <div className="datetime-row">
          <input
            type="date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <input
            type="time"
            className="form-input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <button className="btn btn-primary btn-full-width" onClick={handleSubmit}>
        + Create Event
      </button>
    </div>
  );
};

export default CreateEvent;
