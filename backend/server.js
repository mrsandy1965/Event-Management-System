const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const profileRoutes = require('./routes/profileRoutes');
const eventRoutes = require('./routes/eventRoutes');
const eventUpdateLogRoutes = require('./routes/eventUpdateLogRoutes');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/event-logs', eventUpdateLogRoutes);

app.get('/api', (req, res) => {
    
    res.json({ status: 'ok', message: 'API is running' });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(5001, () => {
    console.log(`Server is running on port ${PORT} - http://localhost:${PORT}`);
});