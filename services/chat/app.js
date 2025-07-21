// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const bodyParser = require("body-parser");
// const morgan = require("morgan");
// const { v4: uuidv4 } = require("uuid");
// const cors = require("cors");

// const chatRoutes = require("./chat.route");
// const ChatModel = require("./chat.model");

// const app = express();
// const server = http.createServer(app);

// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"]
//   }
// });
// app.use(cors());
// app.use(morgan("dev"));
// app.use(bodyParser.json());
// app.use("/chat", chatRoutes);

// const onlineUsers = new Map();

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on("register", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     console.log(`User ${userId} registered with socket ${socket.id}`);
//   });

//   socket.on("sendMessage", async (data) => {
//     const { senderId, receiverId, message } = data;

//     if (!senderId || !receiverId || !message) {
//       console.error("Missing required data:", { senderId, receiverId, message });
//       return;
//     }

//     try {
//       const chatId = createChatId(senderId, receiverId);
//       await ChatModel.sendMessage(senderId, receiverId, message);

//       const receiverSocketId = onlineUsers.get(receiverId);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("receiveMessage", {
//           senderId,
//           receiverId,
//           message
//         });
//       }

//       socket.emit("receiveMessage", {
//         senderId,
//         receiverId,
//         message
//       });

//       socket.emit("receiveMessage", {
//         sender: senderId,
//         receiver: receiverId,
//         content: message,
//         timestamp: Date.now()
//       });
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     for (const [userId, socketId] of onlineUsers.entries()) {
//       if (socketId === socket.id) {
//         onlineUsers.delete(userId);
//         console.log(`User ${userId} disconnected`);
//         break;
//       }
//     }
//   });
// });

// function createChatId(senderId, receiverId) {
//   const ids = [senderId, receiverId].sort();
//   return ids.join("_");
// }

// const PORT = process.env.PORT || 5003;
// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

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
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/chat", chatRoutes);

const onlineUsers = new Map();
const tempMessages = new Map();
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("sendMessage", (data) => {
  const { senderId, receiverId, message } = data;
  const chatId = createChatId(senderId, receiverId);

  const msgObj = {
    sender: senderId,
    receiver: receiverId,
    content: message,
    timestamp: Date.now()
  };

  if (!tempMessages.has(chatId)) {
    tempMessages.set(chatId, []);
  }

  tempMessages.get(chatId).push(msgObj);

  const receiverSocketId = onlineUsers.get(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("receiveMessage", msgObj);
  }
  socket.emit("receiveMessage", msgObj);
});


  socket.on("disconnect", async () => {
  let disconnectedUserId = null;

  for (const [userId, socketId] of onlineUsers.entries()) {
    if (socketId === socket.id) {
      disconnectedUserId = userId;
      onlineUsers.delete(userId);
      break;
    }
  }

  if (disconnectedUserId) {
    for (const [chatId, messages] of tempMessages.entries()) {
      if (chatId.includes(disconnectedUserId) && messages.length > 0) {
        for (const msg of messages) {
          await ChatModel.sendMessage(msg.sender, msg.receiver, msg.content, msg.timestamp);
        }
        tempMessages.delete(chatId);
      }
    }

    console.log(`User ${disconnectedUserId} disconnected and messages saved`);
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
