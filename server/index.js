import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import Routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';
import followRoutes from './routes/follow.js';
import chatRoutes from './routes/chat.js';
import notificationRoutes from './routes/notification.js';

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
app.use('/api/notifications', notificationRoutes);  // Notifications API


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => server.listen(process.env.PORT || 5000, () => console.log('Server running...')))
  .catch((err) => console.log(err.message));

// Real-Time Chat Logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', ({ sender, receiver, message }) => {
    io.emit('receiveMessage', { sender, receiver, message });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
