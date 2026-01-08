const express = require('express');
const router = express.Router();
const eventUpdateLogController = require('../controllers/eventUpdateLogController');


router.get('/:eventId', eventUpdateLogController.getEventLogs);

module.exports = router;
