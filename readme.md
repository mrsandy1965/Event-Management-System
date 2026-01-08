# Event Management System

A simple, clean event management system with multi-timezone support built with React and Node.js.

## ✨ Features

- **Profile Management**: Create and manage multiple user profiles
- **Multi-Timezone Support**: View events in any timezone
- **Event Creation**: Create events with start/end times
- **Event Tracking**: View update history for all events  
- **Clean UI**: Simple, modern light theme interface

## 🛠️ Setup

### Prerequisites
- Node.js (v16+)
- MongoDB running locally

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/event-management
```

Start MongoDB:
```bash
brew services start mongodb-community  # macOS
```

Run backend:
```bash
npm run dev
```

Backend runs on **http://localhost:5001**

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

## 📖 How to Use

1. **Select/Create Profile**: Use the dropdown in the top-right to select a profile
2. **Create Events**:  
   - Click "Select profiles..." to choose who the event is for
   - Pick a timezone
   - Set start and end date/time
   - Click "Create Event"
3. **View Events**: See all events in the right panel  
4. **Change Timezone**: Events automatically convert to your selected view timezone
5. **View Logs**: Click "View Logs" on any event to see update history

## 🏗️ Tech Stack

**Frontend**: React, Context API, fetch API  
**Backend**: Express.js, MongoDB, Mongoose  
**Styling**: Clean CSS with light theme

##Simple & Clean

This project uses basic React patterns:
- **React Context** for state (no external state library needed to understand)
- **fetch()** for API calls (built into JavaScript)
- **Simple CSS** (no frameworks)

No complex dependencies to learn - just React basics!

## 📁 Project Structure

```
frontend/
  src/
    components/       # UI components
    context/         # React Context for state
    utils/           # Timezone helpers
backend/
  models/           # MongoDB schemas
  controllers/      # Business logic
  routes/           # API endpoints
```

## 🔌 API Endpoints

- `POST /api/profiles` - Create profile
- `GET /api/profiles` - Get all profiles
- `POST /api/events` - Create event
- `GET /api/events/profile/:id` - Get profile's events
- `PUT /api/events/:id` - Update event
- `GET /api/event-logs/:eventId` - Get event logs

## 👨‍💻 Made With

React (Vite) + Express.js + MongoDB
