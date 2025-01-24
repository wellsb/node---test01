const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for the Express server
app.use(cors({
  origin: 'http://192.168.0.170', // Client-side origin (update as needed)
  methods: ['GET', 'POST'], // Allowed HTTP methods
  credentials: true, // Enable cookies/auth headers if needed
}));

// Enable CORS for the Socket.IO server
const io = socketio(server, {
  cors: {
    origin: 'http://192.168.0.170', // Client-side origin (update as needed)
    methods: ['GET', 'POST'], // Allowed methods
    credentials: true, // Optional - for credentials
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    console.log(`Message from ${socket.id}: ${msg}`); // Include sender's socket ID
    //io.emit('chat message', msg); // Broadcast to all connected clients
    //json
    io.emit('chat message', { id: socket.id, message: msg });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});