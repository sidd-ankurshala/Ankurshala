const express = require("express");
require("dotenv").config();
const morgan = require('morgan')
require('./helpers/init_mongodb')
const port = process.env.PORT || 5000;
const path = require('path')
const cors = require('cors');
const http = require('http');

const app = express();
app.use(cors());


const server = http.createServer(app);
const io = require('socket.io')(server, {
  pingTimeout: 30000,
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let connectedUsers = {};
let chatMessages = [];

app.use(express.json());
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"));

app.use("/webrtcv1", express.static(path.join(__dirname, 'public', "webrtcv1")));

app.use('/webrtc/proctor', require('./Routes/Proctoring.route'))

app.get('/webrtc/time', (req, res) => {
  res.json({ time: Date.now() });
});


io.on('connection', (socket) => {
  console.log('New client connected');
  // Send existing chat messages to the client upon connection
  socket.on('login', (userData) => {
    connectedUsers[socket.id] = userData;
    console.log(`User ${userData.username} connected.`);
  });

  socket.emit('chatMessages', chatMessages);

  socket.on('disconnect', () => {
    if (connectedUsers[socket.id]) {
      console.log(`User ${connectedUsers[socket.id].username} disconnected.`);
      delete connectedUsers[socket.id];
    }
    console.log('Client disconnected',socket.id);
  });

  // Handle new chat message from client
  socket.on('sendMessage', (message) => {
    console.log('New message received:', message);
    chatMessages.push(message);
    io.emit('newMessage', message); // Broadcast new message to all connected clients
  });
});

// API endpoint to retrieve all chat messages
app.get('/api/messages', (req, res) => {
  res.json(chatMessages);
});

// API endpoint to add a new chat message
app.post('/api/messages', (req, res) => {
  const newMessage = req.body;
  chatMessages.push(newMessage);
  io.emit('newMessage', newMessage); // Broadcast new message to all connected clients
  res.status(201).json(newMessage);
});

app.get('/webrtc/download/Free_Test_Data_500KB_PDF.pdf', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'Free_Test_Data_500KB_PDF.pdf');
  res.download(filePath, 'Free_Test_Data_500KB_PDF.pdf', (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});



// Start the Express server
app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
