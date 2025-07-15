const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");

const chatRoutes = require("./chat.route");
const ChatModel = require("./chat.model");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  }
});

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/chat", chatRoutes);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, message } = data;

    if (!senderId || !receiverId || !message) {
      console.error("Missing required data:", { senderId, receiverId, message });
      return;
    }

    try {
      const chatId = createChatId(senderId, receiverId);
      await ChatModel.sendMessage(senderId, receiverId, message);

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          senderId,
          receiverId,
          message
        });
      }

      socket.emit("receiveMessage", {
        senderId,
        receiverId,
        message
      });

      socket.emit("receiveMessage", {
        sender: senderId,
        receiver: receiverId,
        content: message,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

function createChatId(senderId, receiverId) {
  const ids = [senderId, receiverId].sort();
  return ids.join("_");
}

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
