import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

// Import Routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';
import followRoutes from './routes/follow.js';
import chatRoutes from './routes/chat.js';

// Initialize Environment Variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
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
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Real-Time Chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', ({ sender, receiver, message }) => {
    io.emit('receiveMessage', { sender, receiver, message });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
