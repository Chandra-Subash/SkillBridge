const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const opportunityRoutes = require('./routes/opportunity.js');
const applicationRoutes = require('./routes/application.js');
const messageRoutes = require('./routes/message.js'); // <-- Make sure this is imported

// --- Import Models for Socket Logic ---
const jwt = require('jsonwebtoken');
const User = require('./models/user.js');
const Message = require('./models/message.js');

const app = express();
const PORT = process.env.PORT || 8080;

const MONGO_URL = process.env.MONGO_URL;

const http = require('http');
const { Server } = require("socket.io");

if (!MONGO_URL) {
  console.error("FATAL ERROR: MONGO_URL is not defined in .env file.");
  process.exit(1);
}

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use(cors({ origin: 'http://localhost:3000' })); // Allow REST API calls
app.use(express.json());

// ✅ Serve uploaded avatars statically
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/messages', messageRoutes); // Use the message API routes

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow socket connections
    methods: ["GET", "POST"]
  }
});

// --- THIS IS THE FIX ---

// 1. Create a specific namespace for /api
// This will listen for socket connections on 'http://localhost:8080/api'
const apiSocket = io.of("/api");

// 2. Attach middleware *to the namespace*
apiSocket.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  const secret = process.env.JWT_SECRET;

  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }
    socket.user = user;
    next();
  } catch (err) {
    return next(new Error('Authentication error: Token is invalid'));
  }
});

// This maps a userId to their unique socket.id
const userSocketMap = {};

// 3. Attach connection listener *to the namespace*
apiSocket.on('connection', (socket) => {
  const userId = socket.user._id.toString();
  console.log(`User connected to /api namespace: ${socket.user.name} (Socket ID: ${socket.id})`);

  userSocketMap[userId] = socket.id;

  // Listen for the 'sendMessage' event
  socket.on('sendMessage', async ({ receiver_id, content }) => {
    try {
      const sender_id = socket.user._id;

      // 1. Create and save the message to the database
      const newMessage = await Message.create({
        sender_id,
        receiver_id,
        content
      });

      // Populate the sender info
      const populatedMessage = await Message.findById(newMessage._id).populate('sender_id', 'name avatarUrl role');

      // 2. Find the recipient's socket ID
      const receiverSocketId = userSocketMap[receiver_id];

            // 3. If the recipient is online, send them the new message
          if (receiverSocketId) {
        // 4. Emit *from the namespace*
        apiSocket.to(receiverSocketId).emit('receiveMessage', populatedMessage);
      }

      // 4. Send the message back to the sender
      socket.emit('receiveMessage', populatedMessage);

    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('chatError', { message: 'Failed to send message.' });
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected from /api: ${socket.user.name}`);
    delete userSocketMap[userId];
  });
});
// --- END OF FIX ---


// Start the *HTTP server* (which includes app and io)
server.listen(PORT, () => {
  console.log(`Server (with WebSockets) is running on http://localhost:${PORT}`);
});