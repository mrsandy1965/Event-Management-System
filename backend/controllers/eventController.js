const Event = require('../models/Event');
const EventUpdateLog = require('../models/EventUpdateLog');

const createEvent = async (req, res) => {
  try {
    console.log('Creating event with body:', req.body);
    const { title, description, profiles, timezone, startTime, endTime } = req.body;

    if (!title || !profiles || profiles.length === 0 || !startTime || !endTime) {
      console.log('Validation failed');
      return res.status(400).json({
        error: 'Title, profiles, start time, and end time are required'
      });
    }

    if (new Date(endTime) <= new Date(startTime)) {
      console.log('Time validation failed');
      return res.status(400).json({
        error: 'End time must be after start time'
      });
    }

    console.log('Creating event object...');
    const event = new Event({
      title,
      description,
      profiles,
      timezone: timezone || 'UTC',
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    });

    console.log('Saving event...');
    await event.save();
    console.log('Event saved, populating profiles...');
    await event.populate('profiles');
    console.log('Success! Sending response...');
    res.status(201).json(event);
  } catch (error) {
    console.error('Error in createEvent:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('profiles')
      .sort({ startTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEventsByProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const events = await Event.find({ profiles: profileId })
      .populate('profiles')
      .sort({ startTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('profiles');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { title, description, profiles, timezone, startTime, endTime, updatedBy } = req.body;

    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const newStartTime = startTime ? new Date(startTime) : existingEvent.startTime;
    const newEndTime = endTime ? new Date(endTime) : existingEvent.endTime;

    if (newEndTime <= newStartTime) {
      return res.status(400).json({
        error: 'End time must be after start time'
      });
    }

    const changes = {
      before: {},
      after: {}
    };

    if (title && title !== existingEvent.title) {
      changes.before.title = existingEvent.title;
      changes.after.title = title;
    }
    if (description !== undefined && description !== existingEvent.description) {
      changes.before.description = existingEvent.description;
      changes.after.description = description;
    }
    if (timezone && timezone !== existingEvent.timezone) {
      changes.before.timezone = existingEvent.timezone;
      changes.after.timezone = timezone;
    }
    if (startTime && newStartTime.getTime() !== existingEvent.startTime.getTime()) {
      changes.before.startTime = existingEvent.startTime;
      changes.after.startTime = newStartTime;
    }
    if (endTime && newEndTime.getTime() !== existingEvent.endTime.getTime()) {
      changes.before.endTime = existingEvent.endTime;
      changes.after.endTime = newEndTime;
    }
    if (profiles && JSON.stringify(profiles) !== JSON.stringify(existingEvent.profiles)) {
      changes.before.profiles = existingEvent.profiles;
      changes.after.profiles = profiles;
    }

    const updateData = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(profiles && { profiles }),
      ...(timezone && { timezone }),
      ...(startTime && { startTime: newStartTime }),
      ...(endTime && { endTime: newEndTime }),
      updatedAt: new Date()
    };

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('profiles');

    if (Object.keys(changes.before).length > 0) {
      const log = new EventUpdateLog({
        eventId: req.params.id,
        updatedBy: updatedBy || 'Unknown',
        changes
      });
      await log.save();
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByProfile,
  getEventById,
  updateEvent,
  deleteEvent
};
