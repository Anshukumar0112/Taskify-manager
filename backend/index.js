require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Global Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} request to: ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Static file serving for production
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

app.get('/ping', (req, res) => res.send('Server is updated and running!'));

// Catch-all route to serve the frontend for any other request
app.use((req, res) => {
  if (req.url.startsWith('/api')) return res.status(404).json({ message: 'API route not found' });
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/team_task_manager';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
