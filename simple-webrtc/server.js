const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.static('public'));

const connections = new Map();

io.on('connection', (socket) => {
  console.log();
  connections.set(socket.id, { id: socket.id, type: null, connected: false });

  socket.on('caller-join', () => {
    connections.get(socket.id).type = 'caller';
    socket.broadcast.emit('caller-joined', socket.id);
  });
  socket.on('screener-join', () => {
    connections.get(socket.id).type = 'screener';
    socket.broadcast.emit('screener-joined', socket.id);
  });
  socket.on('offer', (data) => {
    socket.to(data.target).emit('offer', { offer: data.offer, from: socket.id });
  });
  socket.on('answer', (data) => {
    socket.to(data.target).emit('answer', { answer: data.answer, from: socket.id });
  });
  socket.on('ice-candidate', (data) => {
    socket.to(data.target).emit('ice-candidate', { candidate: data.candidate, from: socket.id });
  });
  socket.on('disconnect', () => {
    connections.delete(socket.id);
    socket.broadcast.emit('user-disconnected', socket.id);
  });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'running', connections: connections.size, port: PORT });
});
app.get('/api/connections', (req, res) => {
  res.json(Array.from(connections.values()));
});
app.get('/caller', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'caller.html'));
});
app.get('/screener', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'screener.html'));
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log();
  console.log();
  console.log();
  console.log();
});
