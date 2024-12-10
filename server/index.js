const express = require('express');  // Use require instead of import
const http = require('http');
const { Server } = require('socket.io');  // Use require for Socket.io
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import Routes using require
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const followRoutes = require('./routes/follow');
const chatRoutes = require('./routes/chat');

dotenv.config();
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',  // Allow any origin or specify a specific domain
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/chat', chatRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err.message));

// Real-Time Chat Logic with Socket.io
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for message events from the client
  socket.on('sendMessage', ({ sender, receiver, message }) => {
    io.emit('receiveMessage', { sender, receiver, message });
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
