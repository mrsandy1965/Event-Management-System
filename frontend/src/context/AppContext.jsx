import { createContext, useState, useEffect } from 'react';

const API_URL = 'http://localhost:5001/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all profiles
  const fetchProfiles = async () => {
    try {
      const response = await fetch(`${API_URL}/profiles`);
      const data = await response.json();
      console.log(data);
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  // Create a new profile
  const createProfile = async (profileData) => {
    console.log(profileData);
    try {
      const response = await fetch(`${API_URL}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      const data = await response.json();
      setProfiles([data, ...profiles]);
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  // Update profile timezone
  const updateProfileTimezone = async (profileId, timezone) => {
    try {
      const response = await fetch(`${API_URL}/profiles/${profileId}/timezone`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timezone })
      });
      const data = await response.json();
      setProfiles(profiles.map(p => p._id === profileId ? data : p));
      if (selectedProfile?._id === profileId) {
        setSelectedProfile(data);
        localStorage.setItem('selectedProfile', JSON.stringify(data));
      }
      return data;
    } catch (error) {
      console.error('Error updating timezone:', error);
      throw error;
    }
  };

  // Select profile and save to localStorage
  const selectProfile = (profile) => {
    setSelectedProfile(profile);
    if (profile) {
      localStorage.setItem('selectedProfile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('selectedProfile');
    }
  };

  // Fetch events
  const fetchEvents = async (profileId = null) => {
    setLoading(true);
    try {
      const url = profileId 
        ? `${API_URL}/events/profile/${profileId}`
        : `${API_URL}/events`;
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create event
  const createEvent = async (eventData) => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      const data = await response.json();
      setEvents([data, ...events]);
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  // Update event
  const updateEvent = async (eventId, eventData) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      const data = await response.json();
      setEvents(events.map(e => e._id === eventId ? data : e));
      return data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      await fetch(`${API_URL}/events/${eventId}`, { method: 'DELETE' });
      setEvents(events.filter(e => e._id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  // Fetch event logs
  const fetchEventLogs = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/event-logs/${eventId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching logs:', error);
      return [];
    }
  };

  // Load profiles on mount
  useEffect(() => {
    fetchProfiles();
    
    // Restore selected profile from localStorage
    const savedProfile = localStorage.getItem('selectedProfile');
    if (savedProfile) {
      try {
        setSelectedProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }
  }, []);

  const value = {
    profiles,
    selectedProfile,
    setSelectedProfile,
    events,
    setEvents,
    loading,
    fetchProfiles,
    createProfile,
    updateProfileTimezone,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEventLogs
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
