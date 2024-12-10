import express from 'express';  // Using ESM imports if your Node.js supports it
import http from 'http';
import { Server } from 'socket.io';  // Socket.io for real-time messaging
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import Routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';
import followRoutes from './routes/follow.js';
import chatRoutes from './routes/chat.js';

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
