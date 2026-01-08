const EventUpdateLog = require('../models/EventUpdateLog');

const getEventLogs = async (req, res) => {
  try {
    const { eventId } = req.params;
    const logs = await EventUpdateLog.find({ eventId })
      .sort({ updatedAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEventLogs
};
