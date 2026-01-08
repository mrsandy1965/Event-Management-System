import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import CreateEvent from './CreateEvent';
import EventsList from './EventsList';

const EventManagement = () => {
  const { profiles, selectedProfile, setSelectedProfile, fetchProfiles, createProfile, fetchEvents, setEvents } = useContext(AppContext);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Fetch events when selected profile changes
  useEffect(() => {
    if (selectedProfile) {
      fetchEvents(selectedProfile._id);
    } else {
      // Clear events when no profile is selected
      setEvents([]);
    }
  }, [selectedProfile]);

  const handleProfileChange = (e) => {
    const profileId = e.target.value;
    const profile = profiles.find(p => p._id === profileId);
    setSelectedProfile(profile || null);
    if (profile) {
      localStorage.setItem('selectedProfile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('selectedProfile');
    }
  };

  const handleAddProfile = async () => {
    if (!newProfileName.trim()) return;
    
    try {
      await createProfile({ name: newProfileName, timezone: 'America/New_York' });
      setNewProfileName('');
      setShowAddProfile(false);
      await fetchProfiles();
    } catch (error) {
      alert('Failed to create profile');
    }
  };

  return (
    <>
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <h1>Event Management</h1>
            <p>Create and manage events across multiple timezones</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="profile-selector">
              <select value={selectedProfile?._id || ''} onChange={handleProfileChange}>
                <option value="">Select profile...</option>
                {profiles.map(profile => (
                  <option key={profile._id} value={profile._id}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" onClick={() => setShowAddProfile(true)}>
              + Add Profile
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <CreateEvent />
        <EventsList />
      </div>

      {showAddProfile && (
        <div className="modal-overlay" onClick={() => setShowAddProfile(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Profile</h3>
              <button className="modal-close" onClick={() => setShowAddProfile(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Profile Name</label>
              <input
                type="text"
                className="form-input"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Enter name..."
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAddProfile(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddProfile}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventManagement;
