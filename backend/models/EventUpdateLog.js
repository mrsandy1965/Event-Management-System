const mongoose = require('mongoose');

const eventUpdateLogSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    updatedBy: {
        type: String,
        required: true
    },
    changes: {
        type: Object,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EventUpdateLog', eventUpdateLogSchema);
